var prop=require("../../model/ac/activity")
	,service=require("./service")
	,step=require("step")
	,util=require("util");


exports.acti_curr=function(req,res){
	var models=req.models;
	step(
		function(){
			service.curr_on_acti(models,this);
		},
		function(err,acti){
			if(!acti){
				res.send({result:false,message:'感谢关注，当前没有活动。'})
			}else{
				res.send({result:true,message:'活动进行中，请按步骤上传图片。'});
			}
		}
	)	
}