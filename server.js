/**
 * Module dependencies.
 */
var express = require( 'express' ),
	app = express(),
	http = require( 'http' ),
	server = http.createServer( app ),
	io = require( 'socket.io' ).listen( server ),
	path = require( 'path' ),
	index = require( './routes' ),
	note = require( './routes/note' ),
	notebook = require( './routes/notebook' ),
	search = require( './routes/search' ),
	share = require( './routes/share' );

// all environments
app.set( 'port', process.env.PORT || 1337 );
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );
app.use( express.favicon() );
app.use( express.logger( 'dev' ) );
app.use( express.bodyParser() );
app.use( express.methodOverride() );
app.use( express.cookieParser( 'this is a rather long secret string that is a secret' ) );
app.use( express.session() );
app.use( app.router );
app.use( express.static( path.join( __dirname, 'public' ) ) );

// development only
if ( 'development' === app.get( 'env' ) ) {
	app.use( express.errorHandler() );
}

//Routes that do not require auth
app.get( '/', index.home );
app.get( '/homehelp', index.helpHome );
app.get( '/login', index.signupLogin );

app.post( '/login', index.login );
app.post( '/signup', index.signup );

app.all( '/logout', function ( req, res ) {
	delete req.session.userID;
	res.redirect( '/' );
} );

function requireAuth ( req, res, next ) {
	'use strict';
	if ( !req.session || !req.session.userID || !( req.session.userID.length === 24 || req.session.userID.length === 12 ) ) {
		res.redirect( '/login' );
	} else {
		next();
	}
}

function loadUser ( req, res, next ) {
	'use strict';
	require( './helpers/dbHelper.js' ).findByID( 'users', req.session.userID, function ( err, user ) {
		if ( err ) {
			res.redirect( '/login' );
		} else {
			req.session.user = user;
			next();
		}
	} );
}

//Don't require auth for static files or public pages
app.all( /^((?!(js|map|css|help|login|signup|png|logout)).)+$/i, requireAuth, loadUser );
//Routes that require auth
//GET routes
//Must have non-dynamic routes first
app.get( '/home', notebook.home );
app.get( '/create', notebook.add );

app.get( '/search', search.searchAll );

app.get( '/share', share.share );

app.post( '/share/search', share.search );
app.post( '/share/edit', share.edit );
app.post( '/share/deleteUser', share.deleteUser );
app.post( '/share/changePermission', share.changePermission );
app.post( '/share/addUser', share.addUser );

app.get( '/:id/edit', note.edit );
app.get( '/:id/view', note.view );

app.get( '/:id', notebook.selected );
app.get( '/:id/create', note.add );
app.get( '/:id/search', search.searchNotebook );

app.get( '/homehelp', index.helpHome );
app.get( '/edithelp', function(req, res){
	'use strict';
	res.render( 'edithelp' );
} );

//POST routes
app.post( '/getnote', note.findByID );
app.post( '/update', note.update );

app.post( '/getnotebook', notebook.get );

server.listen( app.get( 'port' ), function () {
	console.log( 'Express server listening on port ' + app.get( 'port' ) );
} );

io.sockets.on( 'connection', function ( socket ) {
	'use strict';
	socket.on('subscribe', function(data){
		socket.join(data.id);
	});

	socket.on('doc_change', function(doc) {
		socket.broadcast.to(doc.id).emit('view_change');
	});
} );