
exports.bind=function (db,models){	
	//用户
	models.User =db.define("ac_user", {
		username: String,
		password: String,
		role :String
	},{
    	id: 'username'
	});
	
}
