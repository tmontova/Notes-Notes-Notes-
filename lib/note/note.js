var dbHelp = require( '../../helpers/dbHelper.js' );

/**
 * Creates a new entry in the notes collection with all of the parameters as attributes.
 * If an error occurs calls callback with the error that occurred.
 * Authors : Timm Allman,
 */
exports.add = function ( notebookID, title, tags, callback ) {
	dbHelp.dbConn( function ( err, db ) {
		if ( err ) {
			callback( err );
			return console.dir( err );
		}

		var note = { notebookID : notebookID, title : title, tags : tags },
			notes = db.collection( 'notes' );
		notes.insert( note, { w : 1 }, function ( err, item ) {
			if ( err ) {
				callback( err );
				return console.dir( err );
			}

			callback( undefined );
			db.close();
		} );
	} );
};

/**
 * Author : Timm Allman,
 */
exports.count = function ( callback ) {
	dbHelp.dbConn( function ( err, db ) {
		if ( err ) {
			callback( err );
			return console.dir( err );
		}

		db.close();
		db.collection( 'notes' ).count( callback );
	} );
};

/**
 * Author : Timm Allman
 */
exports.find = function ( str, ids, callback ) {
	var q = [ { title : { $regex : str, $options : 'i' } }, { tags : { $regex : str, $options : 'i' } } ];
	dbHelp.find( 'notes', q, ids, callback );
};

/**
 * Returns an object representing the note with _id id.
 * Authors : Timm Allman,
 */
exports.findByID = function ( id, callback ) {
	dbHelp.findByID( 'notes', id, callback );
};

/**
 * Saves Note note to the collection.
 * If doc already existed than this is an update, otherwise this is an insert.
 * Authors : Timm Allman,
 */
exports.update = function ( note, callback ) {
	dbHelp.dbConn( function ( err, db ) {
		if ( err ) {
			callback( err );
			return console.dir( err );
		}

		var collection = db.collection( 'notes' );
		collection.save( note, { w : 1 }, function ( err ) {
			if ( err ) {
				callback( err );
				return console.dir( err );
			}
		} );
	} );
};

/**
 *
 * Authors : Timm Allman,
 */
exports.share = function ( note, user, permissions ) {

};