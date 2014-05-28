var ac_user=require("./ac/user")
	,ac_activity=require("./ac/activity")
	,ac_itme=require("./ac/item");

module.exports = function(db,models) {
	ac_user.bind(db,models);
	ac_activity.bind(db,models);
	ac_itme.bind(db,models);
};