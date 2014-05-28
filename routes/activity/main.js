var prop=require("../../model/ac/activity")
	,service=require("../ser_acti")
	,step=require("step");


exports.list=function(req,res){
	var models=req.models;
	var ctx={
		page:0,
		pagenum:10,
		total:0,
		isfirst:function(){
			return this.page==0;
		},
		islast:function(){
			return (this.page+1)*this.pagenum>=this.total;
		}
	}
	if(req.query.page){
		ctx.page=parseInt(req.query.page);
	};
	step(
		function(){
			service.list_all(models,ctx,this);
		},
		function(err,ctx){
			res.render("activity/list",ctx);
		}
	)	
}

exports.create=function(req,res){
	res.render('activity/create',{state_list:prop.state_list});
}

exports.create_save=function(req,res){
	var activity=req.body;
	var models=req.models;
	step(
		function(){
			service.next_no(models,this);
		},
		function(err,no){
			activity.no=no;
			var Acti=models.Activity;
			Acti.create(activity,this);
		},
		function(err,activity){
			if(activity.state=='on'){
				service.off_other(models,activity.id,this);
			}
			return true;
		},
		function(err){
			res.redirect("/activity/list");
		}
	)
}

exports.edit=function(req,res){
	var acti_id=req.query.id;
	var models=req.models;
	var ctx={};
	step(
		function(){
			service.find(models,acti_id,this);
		},
		function(err,acti){
			ctx.acti=acti;
			ctx.state_list=prop.state_list;
			res.render('activity/edit',ctx);
		}
	)
}

exports.edit_save=function(req,res){
	var acti_id=req.query.id;
	var update_params=req.body;
	var models=req.models;
	var ctx={};
	step(
		function(){
			service.find(models,acti_id,this);
		},
		function(err,acti){
			ctx.acti=acti;
			acti.save(update_params,this);
		},
		function(err){
			if(ctx.acti.state=='on'){
				service.off_other(models,ctx.acti.id,this);
			}
			return true;
		},
		function(err){
			res.redirect("/activity/list");
		}
	)
}