var step=require("step");

exports.valid=function(models,username,password,callback){
	var User=models.User;
	step(
		function(){
			User.one({username:username},this);
		},
		function(err,user){
			if(err) console.log(user);
			if(user){
				if(user.password==password){
					callback(null,{result:true,user:user});
				}else{
					callback(null,{result:false});
				}
			}else{
				callback(null,{result:false});
			}
		}
	);
	
}