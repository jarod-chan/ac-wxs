var orm = require("orm")
	,model_def=require("../model");
var models={};
orm.connect("mysql://root:0@localhost/ac-wxs-dev", function (err, db) {
	model_def(db,models);
	var Item=models.Item;
	Item.get(39,function(err,item){
	 	if(err) console.log(err);
	 	console.log(item.id);
	 	console.log(item.wx_id);
	})
});