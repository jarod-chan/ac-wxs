var prop=require("../../model/ac/activity")
	,ser_acti=require("../ser_acti")
	,ser_item=require("../ser_item")
	,step=require("step")
	,util=require("util");


exports.verify_main=function(req,res){
	var models=req.models;
	var ctx={};
	step(
		function(){
			ser_acti.curr_acti(models,this);
		},
		function(err,acti){
			ctx.acti=acti;
			res.render("verify/main",ctx);
		}
	)	
}

exports.verify_code=function(req,res){
	var models=req.models;
	var acti_id=req.query.id;
	var rt_code=req.body.rt_code;

	var update_item;
	var rt_message;
	step(
		function(){
			ser_acti.find(models,acti_id,this.parallel());
			ser_item.query(models,{ac_id:acti_id,rt_code:rt_code},this.parallel());
		},
		function(err,acti,item_list){
			if(!acti||acti.state=='off'){
				return {
					level:'error',
					message:'当前活动已经关闭，无法再进行领取码校验。'
				}
			}

			var item;
			if(item_list.length>0){
				item=item_list[0];
			}


			if(!item){
				return {
					level:'error',
					message:util.format('领取码[%s]校验失败，请重新确认。',rt_code)
				}
			}else if(item.state =='cfmed'){
				update_item=item;
				return {
					level:'info',
					message:util.format('领取码[%s]校验通过。',rt_code)
				}
			}else if(item.state =='recv'){
				return {
					level:'warn',
					message:util.format('领取码[%s]校验通过,但已经领取过。',rt_code)
				}
			}else{
				return {
					level:'error',
					message:util.format('领取码[%s]校验失败，请重新确认。',rt_code)
				}
			}
		},
		function(err,message){
			rt_message=message;
			if(update_item){
				update_item.save({state:'recv'},this);
			}
			return true;
		},
		function(err){
			if(err) console.log(err);
			res.send(rt_message);
		}
	)

}