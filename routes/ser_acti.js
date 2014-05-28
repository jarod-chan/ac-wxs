var step=require("step"),
	orm=require("orm");

exports.list_all=function(models,ctx,callback){
	var Acti=models.Activity;

	step(
		function(){
			Acti.count({},this);
		},
		function(err,count){
			ctx.total=count;
			return true;
		},
		function(err){
			Acti.find()
				.order("-id")
				.offset(ctx.page*ctx.pagenum)
				.limit(ctx.pagenum)
				.run(this);
		},
		function(err,acti_list){
			if(err){callback(err);return};
			acti_list=acti_list||[];
			ctx.acti_list=acti_list;
			callback(null,ctx);
		}
	)
}


exports.next_no=function(models,callback){
	var Acti=models.Activity;

	Acti.find()
		.order("-id")
		.limit(1)
		.run(function(err,acti_list){
			if(err){callback(err);return};
			acti_list=acti_list||[];
			if(acti_list.length==0){
				callback(null,'HD0001');
				return;
			}
			no = acti_list[0].no;
			no = next(no);
			callback(null,no)
		});
}


function next(no){
	var num=parseInt(no.substring(2));
	var next="0000"+(num+1);
	var idx=next.length-4;
	return 'HD'+next.substring(idx);
}

exports.off_other=function(models,on_id,callback){
	step(
		function(){
			var Acti=models.Activity;
			Acti.find({state:"on",id:orm.ne(on_id)})
				.run(this);
		},
		function(err,acti_list){
			if(err) callback(err);
			acti_list=acti_list||[];
			if(acti_list.length>0){
				var group = this.group();
				for (var i = 0; i < acti_list.length; i++) {
					acti_list[i].state="off";
					acti_list[i].save(group());
				}
			}
			callback(null,true);
		}
	)
}


exports.find=function(models,id,callback){
	var Acti=models.Activity;
	Acti.get(id,function(err,acti){
		if(err) callback(err);
		callback(null,acti);
	})
}

exports.curr_acti=function(models,callback){
	var Acti=models.Activity;
	Acti.find({or:[{state:'on'},{state:'stop'}]})
		.run(function(err,acti_list){
			if(err) callback(err);
			acti_list=acti_list||[];
			var acti={};
			if(acti_list.length>0){
				acti=acti_list[0];
			}
			callback(err,acti);
		})
}
