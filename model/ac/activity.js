
exports.bind=function (db,models){	
	//活动
	models.Activity =db.define("ac_activity", {
		id: Number,
		no: String,
		name: String,
		state:['on','off'] //on-启用 off-关闭
	},{
		methods: {
			get_state:get_state,
		}
	});
	
}


function get_state() {
   var state_map={
		on:'启用',
		stop:'停止',
		off:'关闭'
   }
   return state_map[this.state];
}


exports.state_list=[{val:'on',name:'启用'},{val:'stop',name:'停止'},{val:'off',name:'关闭'}]