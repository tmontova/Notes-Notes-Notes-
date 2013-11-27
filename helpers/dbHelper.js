/**
 * Created by tallman on 11/10/13.
 */

var MongoClient = require( 'mongodb' ).MongoClient;

exports.dbConn = function( callback ) {
	MongoClient.connect( "mongodb://team326:notesnotesnotes@timm-allman.mynetgear.com:27017/notesjs", callback);
};