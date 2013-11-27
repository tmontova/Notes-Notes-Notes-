/**
 * Created by tallman on 11/1/13.
 */
var dbHelp = require( '../../helpers/dbHelper.js' );
var ObjectID = require( 'mongodb' ).ObjectID;

exports.addNote = function( notebookId, title, tags ) {
var note = {notebookID: notebookId,
					title: title,
					tags: tags };
					
	dbHelp.dbConn(function( err, db ){
		var notes = db.collection( 'notes');
		if(err)
			callback(err);
		else{
			notes.insert(note, function (err, db){
				callback(err, docs);
			});
		}
});
};

// Returns note based on it's ID
exports.getNote = function(id, callback) {
	dbHelp.dbConn( function ( err, db ){
		var collection = db.collection( 'notes' );
		if(err)
			callback(err);
		else{
			collection.findOne({"_id" : new ObjectID(id) }, function(err, item) {
				if(err)
					callback(err);
				else{
					callback(undefined, item);			
				}
			});
		}
	});
};

// Updates doc based on ID, if ID doesn't exist it adds a new one
exports.updateDoc = function(doc, callback){ 
	dbHelp.dbConn( function ( err, db ) {
		var collection = db.collection( 'notes' );
		if(err)
			callback(err)
		else{
			doc._id = new ObjectID(doc._id);
			collection.save(doc, function(err){
					if(err) 
						callback(err);
					else
						callback(undefined, doc);
					});
			}
	});
};

exports.addNoteTags = function( note, tags ) {

};

exports.shareNote = function( note, user, permissions ) {

};

exports.find = function( str, user, callback ) {
	dbHelp.dbConn( function( err, db ) {
		if ( err ) console.dir( err );

		var notes = db.collection( 'notes' );
		notes
			.find( { $or : [
				{ title : { $regex : str, $options : 'i' } },
				{tags : { $regex : str, $options : 'i' } }
			] }, { title : 1, tags : 1, sharedWith : 1 } )
			.toArray( function( err, docs ) {
				if ( err ) console.dir( err );
				docs.forEach(function (value, index, ar) {
					ar[index].type = 'note';
				});
				callback( docs, db );
			} );
	} );
};
exports.listThem = function(callback){
dbHelp.dbConn( function( err, db ) {
		if ( err ) console.dir( err );

		var note = db.collection( 'notes' );
		note.find().toArray( function( err, docs ) {
				if ( err ) console.dir( err );
				docs.forEach(function (value, index, ar) {
					ar[index].type = 'note';
				});
				callback( docs, db );
			} );
	} );
};
