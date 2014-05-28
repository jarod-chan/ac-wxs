var step=require("step"),
	orm=require("orm"),
	util=require("util");


exports.curr_on_acti=function(models,callback){
	curr_on_acti_in(models,callback);	
}

function curr_on_acti_in(models,callback){
	var Acti=models.Activity;
	Acti.one({state:'on'},callback);	
}

//检查图片是否可以上传，如果可以，则返回true和活动id
//如果不可以，则返回false和原因
exports.can_upload=function(models,wx_id,callback){
	var Acti=models.Activity;
	var Item=models.Item;

	var goto_end=false;
	var ret={};
	var ctx_acti={};
	step(
		function(){
			curr_on_acti_in(models,this);	
		},
		function(err,acti){
			if(err) callback(err);
			if(acti){
				ctx_acti=acti;
				Item.one({ac_id:acti.id,wx_id:wx_id},this);
			}else{
				ret={result:false,message:'当前没有活动'};
				goto_end=true;
				return true;
			}
		},
		function(err,item){
			if(goto_end) {
				callback(null,ret);
				return;
			}
			
			if(item){
				switch(item.state){                                      //'uncfm','cfmed','nopass','recv'
					case 'uncfm':
						ret={result:false,message:'你已参与活动，正在等待管理员确认'};break;
					case 'cfmed':
						ret={result:false,message:'你的图片已确认，请输入?查询领取码'};break;
					case 'nopass':
						ret={result:true,message:'图片可以上传',ac_id:ctx_acti.id};break;
					case 'recv':
						ret={result:false,message:'你已参与该活动'};break;
				}
				callback(null,ret);
				return;
			}else{
				ret={result:true,message:'图片可以上传',ac_id:ctx_acti.id};
				callback(null,ret);
				return;
			}
		}
	)
}

//图片上传成功的时候，更新相应的记录
exports.update_filename=function (models,acti_id,wx_id,filename,callback){
	var Item=models.Item;
	step(
		function(){
			Item.one({ac_id:acti_id,wx_id:wx_id},this);
		},
		function(err,item){
			if(item){
				var update_data={
					img:filename,
					commit_time:new Date(),
					state:'uncfm',
					rt_code:null,
					rt_message:null
				}
				item.save(update_data,callback);
			}else{
				var new_item={
					ac_id:acti_id,
					wx_id:wx_id,
					img:filename,
					commit_time:new Date(),
					state:'uncfm',
					rt_code:null,
					rt_message:null
				}
				Item.create(new_item,callback);
			}
		}
	)
}


function curr_on_and_stop_acti(models,callback){
	var Acti=models.Activity;
	Acti.one({or:[{state:'on'},{state:'stop'}]},callback);
}

exports.ques_message=function(models,wx_id,callback){
	var Acti=models.Activity;
	var Item=models.Item;

	var goto_end=false;
	var ret={};
	step(
		function(){
			curr_on_and_stop_acti(models,this);	
		},
		function(err,acti){
			if(err) callback(err);
			if(acti){
				Item.one({ac_id:acti.id,wx_id:wx_id},this);
			}else{
				ret={result:false,message:'当前没有活动'};
				goto_end=true;
				return true;
			}
		},
		function(err,item){
			if(goto_end) {
				callback(null,ret);
				return;
			}
			
			if(item){
				switch(item.state){                                      //'uncfm','cfmed','nopass','recv'
					case 'uncfm':
						ret={result:false,message:'你已参与该活动，正在等待管理员确认'};break;
					case 'cfmed':
						ret={result:false,message:util.format("你的领取码为：%s，请到活动指定地点领取",item.rt_code)};break;
					case 'nopass':
						ret={result:true,message:util.format('你的图片未通过确认，你可以按步骤重新上传图片，未通过的的具体原因：%s',item.rt_message)};break;
					case 'recv':
						ret={result:false,message:'你已参与过该活动'};break;
				}
				callback(null,ret);
				return;
			}else{
				ret={result:true,message:'你还未参与活动，请按活动指定步骤上传图片'};
				callback(null,ret);
				return;
			}
		}
	)
}