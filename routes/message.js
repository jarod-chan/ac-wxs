

exports.append=function(req,ctx){
	if(ctx){
		ctx.msg=req.flash('msg')[0];
		return ctx;
	}else{
		return {msg:req.flash('msg')[0]};
	}
}