/**
 * Author : Timm Allman
 */
var MongoDB = require( 'mongodb' ),
	MongoClient = MongoDB.MongoClient,
	db = 'mongodb://team326:notesnotesnotes@timm-allman.mynetgear.com:27017/notesjs',
	search = require( './search.js' );

exports.dbConn = function ( callback ) {
	'use strict';
	MongoClient.connect( db, { db : { native_parser : true } }, callback );
};

exports.find = search.find;
exports.findByID = search.findByID;