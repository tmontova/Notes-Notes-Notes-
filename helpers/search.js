/**
 * Author: Timm Allman
 */
var dbHelp = require( './dbHelper.js' ),
	ObjectID = require( 'mongodb' ).ObjectID;

exports.find = function ( collection, query, ids, callback ) {
	var type = collection.substring( 0, collection.length - 1 );
	dbHelp.dbConn( function ( err, db ) {
		if ( err ) {
			return console.dir( err );
		}

		var col = db.collection( collection );
		col.find( { $and : [ { $or : ids }, { $or : query } ] } ).toArray( function ( err, docs ) {
			if ( err ){
				db.close();
				return console.dir( err );
			}

			db.close();

			docs.forEach( function ( value, index, ar ) {
				ar[ index ].type = type;
			} );

			callback( docs );
		} );
	} );
};

exports.findByID = function ( collection, id, callback ) {
	'use strict';
	dbHelp.dbConn( function ( err, db ) {
		if ( err ) {
			callback( err );
			return console.dir( err );
		}

		var _id = new ObjectID( id );
		db.collection( collection ).findOne( { _id : _id }, function ( err, item ) {
			if ( err ) {
				db.close();
				callback( err );
				return console.dir( err );
			}

			db.close();
			callback( undefined, item );
		} );
	} );
};