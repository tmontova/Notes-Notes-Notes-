var User = require( '../lib/user/' );

/*
 * GET home page.
 * Author : 
 */
exports.home = function ( req, res ) {
	res.render( 'index', { title : 'Home' } );
};

/*
 * GET login/signup page.
 * Author : 
 */
exports.signupLogin = function ( req, res ) {
	if( typeof req.session.userID !== 'undefined' ) {
		res.redirect( '/home' );
	} else {
		res.render( 'login', { title : 'Login/SignUp', noLogin : true } );
	}
};

/**
 * POST signup
 * Authors : Timm Allman,
 */
exports.signup = function ( req, res ) {
	var fname = req.body['first-name'],
		lname = req.body['last-name'],
		email = req.body['signup-email'],
		pswd = req.body['signup-password'],
		cpswd = req.body['confirm-password'];

	if ( fname > 60 ) {
		res.render( 'login', { title : 'Login/Signup', signuperrmsg : 'First Name must be fewer than 60 characters' } );
	} else if ( lname > 60 ) {
		res.render( 'login', { title : 'Login/Signup', signuperrmsg : 'Last Name must be fewer than 60 characters' } );
	} else if ( pswd.length < 6 || pswd.length > 12 ) {
		res.render( 'login', { title : 'Login/Signup', signuperrmsg : 'Password must be between 6 and 12 characters' } );
	} else if ( pswd !== cpswd ) {
		res.render( 'login', { title : 'Login/Signup', signuperrmsg : 'Password must match Confirmation Password' } );
	} else {
		User.add( fname, lname, email, pswd, function ( err, uid ) {
			if ( err ) {
				console.dir( err );
				res.render( 'login', { title : 'Login/Signup', signuperrmsg : 'Something went wrong. Please try again in a few minutes.'} );
			} else if ( uid === null ) {
				res.render( 'login', { title : 'Login/Signup', signuperrmsg : 'A user with that email already exists. Please use a different email.'} );
			} else {
				req.session.userID = uid;
				res.redirect( '/home' );
			}
		} );
	}
};

/**
 * POST login
 * Authors : Timm Allman,
 */
exports.login = function ( req, res ) {
	var email = req.body['login-email'],
		pswd = req.body['login-password'];

	User.auth( email, pswd, function ( err, uid ) {
		if ( err ) {
			console.dir( err );
			res.render( 'login', { title : 'Login/Signup', signuperrmsg : 'Something went wrong. Please try again in a few minutes.'} );
		} else if ( uid === null ) {
			res.render( 'login', { title : 'Login/Signup', loginerrmsg : 'Incorect username or password'} );
		} else {
			req.session.userID = uid;
			res.redirect( '/home' );
		}
	} );
};

/**
 * Author :
 */
exports.helpHome = function ( req, res ) {
	res.render( 'homehelp', { title : 'Help', noLogin : true } );
};