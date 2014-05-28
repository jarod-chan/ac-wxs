var prop=require("../../model/ac/activity")
	,service=require("./service")
	,step=require("step")
	,msg_tool=require("../message");

exports.login=function(req,res){
	ctx=msg_tool.append(req);
	res.render("login/main.html",ctx);
}

exports.dologin=function(req,res){
	var models=req.models;
	var data=req.body;
	
	step(
		function(){
			service.valid(models,data.username,data.password,this);
		},
		function(err,rt){
			if(err) console.log(err);
			if(rt.result){
				req.session.user = {username:rt.user.username};
				if(rt.user.role=="confirm_img"){
					res.redirect("/activity/list");
				}else if(rt.user.role=="verify_code"){
					res.redirect("/verify_main");
				}
			}else{
				req.flash('msg',{
					level:'error',
					message:'用户名或密码不匹配。'
				});
				res.redirect("/login");
			}
		}
	)
}

exports.dologout=function(req,res){
	if (req.session) {
	 	req.session.user=null;
	}
	res.redirect('/login');
}