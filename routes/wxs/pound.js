var prop=require("../../model/ac/activity")
	,service=require("./service")
	,step=require("step")
	,util=require("util");

//查询能否上传
exports.pound=function(req,res){
	var models=req.models;
	var wx_id=req.query.wx_id;

	service.can_upload(models,wx_id,function(err,rt){
		res.send(rt);
	})
}