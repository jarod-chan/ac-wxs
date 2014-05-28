var moment=require("moment");

exports.bind=function (db,models){	
	//活动详细
	models.Item =db.define("ac_item", {
		id: Number,
		ac_id: Number,
		wx_id: String,
		img: String,
		commit_time: {type:"date",time:true},
		state: ['uncfm','cfmed','nopass','recv'],
		rt_code: String, 
		rt_message:String
	},{
		methods:{
			get_state:get_state,
			get_commit_time:get_commit_time
		}
	});
}

function get_state() {
   var state_map={
		uncfm:'未确认',
		cfmed:'已确认',
		nopass:'未通过',
		recv:'已领取'
   }
   return state_map[this.state];
}

function get_commit_time(){
	return moment(this.commit_time).format("YYYY-MM-D HH:mm:ss");
}

exports.state_list=[{val:'uncfm',name:'未确认'},{val:'cfmed',name:'已确认'},{val:'nopass',name:'未通过'},{val:'recv',name:'已领取'}]

