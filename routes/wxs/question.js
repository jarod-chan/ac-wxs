var prop=require("../../model/ac/activity")
	,service=require("./service")
	,step=require("step")
	,util=require("util");

//查询参与结果
exports.ques=function(req,res){
	var models=req.models;
	var wx_id=req.query.wx_id;
	service.ques_message(models,wx_id,function(err,rt){
		if(err) console.log(err);
		res.send(rt);
	});
}