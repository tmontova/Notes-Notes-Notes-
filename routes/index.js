/*
 * GET home page.
 */
var userhomeurl = '../';
var userdb = require('../lib/user/user.js');
exports.home = function (req, res) {
    res.render('index', { title: 'Notes! Notes! Notes!'});
};
exports.login = function (req, res) {
    res.render('login', { title: 'Notes! Notes! Notes!'});
};
exports.submit = function (req, res) {
    if (req.body['first-name']) {
        if (req.body['first-name'] > 60) {
            res.render('login', { title: 'Notes! Notes! Notes!', signuperrmsg: 'Maximum "First Name" length is 60 characters'});
        }
        else if (req.body['last-name'] > 60) {
            res.render('login', { title: 'Notes! Notes! Notes!', signuperrmsg: 'Maximum "Last Name" length is 60 characters'});
        }
        else if (req.body['signup-password'] !== req.body['confirm-password']) {
            res.render('login', { title: 'Notes! Notes! Notes!', signuperrmsg: '"Confirm Password" must match "Password"'});
        }
        else if (req.body['signup-password'].length > 12) {
            res.render('login', { title: 'Notes! Notes! Notes!', signuperrmsg: 'Maximum "Password" length is 12 characters'});
        }
        else {
            userdb.findUser(req.body['signup-email'], function (findreturn) {
                if (typeof findreturn == "object") {
                    res.render('login', { title: 'Notes! Notes! Notes!', signuperrmsg: 'User already exists with provided e-mail'});
                }
                else if (findreturn < 0) {
                    res.render('login', { title: 'Notes! Notes! Notes!', signuperrmsg: 'Failed to access database'});
                }
                else {
                    //add user to db
                    userdb.addUser(req.body['first-name'], req.body['last-name'], req.body['signup-email'], req.body['signup-email'], req.body['signup-password'], function (returnid) {
                            var id = returnid;
                            if (!id || id < 0) {
                                res.render('login', { title: 'Notes! Notes! Notes!', signuperrmsg: 'Failed to access database'});
                            }
                            else {
                                //redirect to user home page with id stored in cookies as "userid" warning: not a number
                                res.cookie("userid", id);
                                res.redirect(userhomeurl);
                            }
                        }
                    );
                }
            });
        }
    }

    else if (req.body['login-email']) {
        userdb.authent(req.body['login-email'], req.body['login-password'], function (returnid) {
            var id = returnid;
            if (!id) {
                res.render('login', { title: 'Notes! Notes! Notes!', loginerrmsg: 'There is no account with that username/password combination'});
            }
            else if (id < 0) {
                res.render('login', { title: 'Notes! Notes! Notes!', loginerrmsg: 'Failed to access database'});
            }
            else {
                //redirect to user home page with id stored in cookies as "userid" warning: not a number
                res.cookie("userid", id);
                res.redirect(userhomeurl);
            }
        });
    }
    else {
        res.render('login', { title: 'Notes! Notes! Notes!', signuperrmsg: 'Please log in or sign up to continue', loginerrmsg: 'Please log in or sign up to continue'});
    }
};