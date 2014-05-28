var step=require("step"),
	orm=require("orm");


exports.item_list=function(models,id_list,callback){
	var Item=models.Item;
	step(
		function(){
			var group = this.group();
			for (var i = 0; i < id_list.length; i++) {
				Item.get(id_list[i],group());
			}
		},
		function(err,item_list){
			if(err) console.log(err);
			item_list=item_list||[];
			callback(err,item_list);
		}
	)
}

exports.item_uncfm_list=function(models,ac_id,callback){
	var Item=models.Item;
	Item.find({ac_id:ac_id,state:'uncfm'})
		.order("commit_time")
		.run(function(err,item_list){
			if(err) callback(err);
			item_list=item_list||[];
			callback(null,item_list);
		})
}


exports.item_uncfm_id_list=function(models,ac_id,callback){
	var Item=models.Item;
	Item.find({ac_id:ac_id,state:'uncfm'})
		.order("commit_time")
		.only("id")
		.run(function(err,item_list){
			if(err) callback(err);
			item_list=item_list||[];
			var id_list=[];
			for (var i = 0; i < item_list.length; i++) {
				id_list.push(item_list[i].id);
			};
			callback(null,id_list);
		})
}

exports.item_deal_one=function(models,item_id,to_data,callback){
	var Item=models.Item;
	if(to_data.state=='cfmed'){
		step(
			function(){
				Item.get(item_id,this);
			},
			function(err,item){
				if(err) callback(err);
				var new_data={state:'cfmed',rt_code:getCode()};
				item.save(new_data,callback);
			}
		)
	}
	if(to_data.state=='nopass'){
		step(
			function(){
				Item.get(item_id,this);
			},
			function(err,item){
				if(err) callback(err);
				item.save(to_data,callback);
			}
		)
	}
}

function getCode(){
	var code="";
	for (var i = 0; i < 8; i++) {
	   code+=String(fRandomBy(0,9));
	}
	return code;
}


function fRandomBy(under, over){ 
    switch(arguments.length){ 
        case 1: return parseInt(Math.random()*under+1); 
        case 2: return parseInt(Math.random()*(over-under+1) + under);  
        default: return 0; 
    } 
} 


exports.query=function(models,param,callback){
	var Item=models.Item;
	Item.find(param)
		.run(function(err,item_list){
			if(err) callback(err);
			item_list=item_list||[];
			callback(null,item_list);
		});
}


exports.page_query=function(models,page,callback){
	var Item=models.Item;
	var param={ac_id:page.acti_id};
	if(page.state&&page.state!='all'){
		param.state=page.state;
	}
	step(
		function(){
			Item.count(param,this);
		},
		function(err,count){
			if(err) callback(err);
			page.total=count;
			return true;
		},
		function(err){
			Item.find(param)
				.order("-commit_time")
				.offset(page.page*page.pagenum)
				.limit(page.pagenum)
				.run(this);
		},
		function(err,item_list){
			if(err) callback(err);
			page.data=item_list;
			callback(null,page);
		}
	)
}

