var prop=require("../../model/ac/activity")
	,service=require("./service")
	,step=require("step")
	,filedown= require("./filedown")
	,util=require("util");


exports.filter_upload=function(req,res,next){
	var models=req.models;
	var wx_id=req.body.wx_id;

	service.can_upload(models,wx_id,function(err,rt){
		if(rt.result){
			req.img_param={acti_id:rt.ac_id};
			res.send({result:true,message:'上传成功'});
			next();
		}else{
			res.send(rt);
		}
	})
}



exports.img_upload=function(req,res){
	var models=req.models;
	var data=req.body;
	var wx_id=req.body.wx_id;
	var acti_id=req.img_param.acti_id;
	step(
		function(){
			filedown.download(data.img_url,this);
		},
		function(err,filename){
			service.update_filename(models,acti_id,wx_id,filename,this);
		},
		function(err){
			if(err) console.log(err);
		}
	)
}

