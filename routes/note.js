/**
 * Created by tallman on 10/28/13.
 */
var Note = require( '../lib/note' );

exports.add = function ( req, res ) {
	'use strict';
	var _id = new require( 'mongodb' ).ObjectID( req.params.id );
	Note.count( function ( err, num ) {
		var title;
		if ( typeof req.query.title !== 'undefined' ) title = req.query.title;
		else title = 'title' + num;
		Note.add( _id, title, [], function ( err ) {
			if ( err )
				console.error( "db failed: " + err );
			else
				res.redirect( '/' + req.params.id );
		} );
	} );
};

exports.view = function ( req, res ) {
	res.render( 'view-note', { title : 'View Note', id : req.params.id } );
};

exports.edit = function ( req, res ) {
	res.render( 'notetaking', { title : 'Edit Note' , id : req.params.id, loginPage : "edit" } );
};

exports.findByID = function ( req, res ) {
	if ( req.body ) {
		var id = req.body._id;
		Note.findByID( id, function ( err, item ) {
			if ( err )
				console.error( "db failed: " + err );
			else {
				res.contentType( 'application/json' );
				res.send( item );
			}
		} );
	}
};

exports.update = function ( req, res ) {
	if ( req.body ) {
		var doc = req.body.doc;
		Note.update( doc, function ( error, item ) {
			if ( error )
				console.error( "db failed: " + error );
			else {
				res.contentType( 'application/json' );
				res.send( item );
			}
		} );
	}
};

exports.remove = function ( req, res ) {
	if ( req.body ) {
		var userID = req.body.data;

		Note.remove( userID, function ( err, docs ) {
			if ( err ) {
				console.error( 'db failed: ' + err );
			}
			else {
				res.send( [] );
			}
		} );

	}
};