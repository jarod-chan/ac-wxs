var prop=require("../../model/ac/activity")
	,ser_acti=require("../ser_acti")
	,ser_item=require("../ser_item")
	,step=require("step");

exports.item_action=function(req,res){
	var acti_id=req.query.id;
	var models=req.models;
	var ctx={};
	step(
		function(){
			ser_acti.find(models,acti_id,this);
		},
		function(err,acti){
			ctx.acti=acti;
			return true;
		},
		function(err){
			ser_item.item_uncfm_id_list(models,acti_id,this);
		},
		function(err,id_list){
			if(err) console.log(err);
			ctx.id_list=id_list;
			res.render("item/action",ctx);
		}
	)
}

exports.item_deal=function(req,res){
	var item_id=req.query.id;
	var to_data=req.body;
	var models=req.models;
	step(
		function(){
			ser_item.item_deal_one(models,item_id,to_data,this);
		},
		function(err){
			if(err) console.log(err);
			res.send(true);
		}
	)
}

exports.item_deal_batch=function(req,res){
	var models=req.models;
	var to_data=req.body;
	step(
		function(){
			var group = this.group();
			var id_list=to_data.id_list;
			for (var i = 0; i < id_list.length; i++) {
				ser_item.item_deal_one(models,id_list[i],to_data,group());
			};
		},
		function(err){
			if(err) console.log(err);
			res.send(true);
		}
	)
}

exports.item_list=function(req,res){
	var models=req.models;
	var id_list=req.query.id_list; 
	console.log(id_list);
	step(
		function(){
			ser_item.item_list(models,id_list,this);
		},
		function(err,item_list){
			var item_fmt_list=[];
			for (var i = 0; i < item_list.length; i++) {
				var from=item_list[i];
				var to={
					id:from.id,
					wx_id: from.wx_id,
					img: from.img,
					commit_time: from.get_commit_time(),
					state: from.get_state()
				}
				item_fmt_list.push(to);
			}
			res.send(item_fmt_list);
		}
	)
}

var state_list=require("../../model/ac/item").state_list;

exports.item_history=function(req,res){
	var models=req.models;
	var data=req.query;
	var page={
		acti_id:req.query.id,
		state:"all",
		page:0,
		pagenum:10,
		total:0,
		isfirst:function(){
			return this.page==0;
		},
		islast:function(){
			return (this.page+1)*this.pagenum>=this.total;
		}	
	};
	if(data.state){
		page.state=data.state;
	}
	if(data.page){
		page.page=parseInt(data.page);
	}
	
	var ctx={state_list:state_list};
	step(
		function(){
			ser_acti.find(models,page.acti_id,this);
		},
		function(err,acti){
			ctx.acti=acti;
			return true;
		},
		function(){
			ser_item.page_query(models,page,this)
		},
		function(err,page){
			ctx.page=page;
			res.render("item/history",ctx);
		}
	)
}