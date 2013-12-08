/**
 * Created by tallman on 10/28/13.
 */
var Notebook = require( '../lib/notebook' );

exports.add = function ( req, res ) {
	'use strict';
	Notebook.count( function ( err, num ) {
		var title;
		if ( typeof req.query.title !== 'undefined' ) title = req.query.title;
		else title = 'title' + num;

		Notebook.add( req.session.user._id, title, [], function ( err ) {
			if ( err )
				console.error( "db failed: " + err );
			else
				res.redirect( '/home' );
		} );
	} );
};

exports.home = function ( req, res ) {
	'use strict';
	var user = req.session.user;

	Notebook.find( '', [ { userID : user._id }, { 'shared.with' : user._id } ], function ( results, db ) {
		res.render( 'home',
			{
				title : 'Home',
				results : results,
				signedInUser : req.session.user,
				home : true
			}
		);
	} );
};

exports.selected = function ( req, res ) {
	'use strict';
	var Note = require( '../lib/note' );

	Notebook.findByID( req.params.id, function ( err, notebook ) {
		Note.find( '', [ { notebookID : notebook._id } ], function ( results ) {
			res.render( 'selectednotebook',
				{
					title : notebook.title,
					id : req.params.id,
					results : results,
					signedInUser : req.session.user,
					selectedNotebook : notebook
				}
			);
		} );
	} );
};

exports.get = function ( req, res ) {
	'use strict';
	if ( req.body ) {
		var id = req.body._id;
		Notebook.findByID( id, function ( err, item ) {
			if ( err ) {
				console.error( 'db failed: ' + err );
			} else {
				res.contentType( 'application/json' );
				res.send( item );
			}
		} );
	}
};