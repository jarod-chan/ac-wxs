var login= require('./login/main')
    activity = require('./activity/main'),
	item = require('./item/main'),
    verify= require('./verify/main'),
    s_acti= require('./wxs/acti'),
    s_pound= require('./wxs/pound'),
    s_img= require('./wxs/img'),
    s_question= require('./wxs/question');


module.exports = function(app) {

    app.get('/login',login.login);
    app.post('/login',login.dologin);

    app.post('/logout',login.dologout);

    
    app.get('/activity/list',filter,activity.list);

    app.get('/activity/create',filter,activity.create);

    app.post('/activity/create_save',filter,activity.create_save);

    app.get('/activity/edit',filter,activity.edit);

    app.post('/activity/edit_save',filter,activity.edit_save);


    app.get('/item_action',filter,item.item_action);

    app.post('/item_deal',filter,item.item_deal);

    app.post('/item_deal_batch',filter,item.item_deal_batch);

    app.get('/item_list',filter,item.item_list);

    app.get('/item_history',filter,item.item_history);


    app.get("/verify_main",filter,verify.verify_main); 

    app.post("/verify_code",filter,verify.verify_code);


    app.get("/s/acti",s_acti.acti_curr);

    app.get("/s/pound",s_pound.pound);

    app.post("/s/img",s_img.filter_upload);
    app.post("/s/img",s_img.img_upload);

    app.get("/s/question",s_question.ques);
}

function filter (req, res, next) {
    if (req.session.user) {
        res.locals.session_user = req.session.user;
        next();
    } else {
        req.flash('msg',{
            level:'error',
            message:'登陆可能已超时，请重新登陆。'
        });
        res.redirect('/login');
    }
}



