var dbHelp = require( '../../helpers/dbHelper.js' );

/**
 * Creates a new entry in the notebook collection with all of the parameters as attributes.
 * If an error occurs calls callback with the error that occurred.
 * Authors : Timm Allman,
 */
exports.add = function ( userID, title, tags, callback ) {
	dbHelp.dbConn( function ( err, db ) {
		if ( err ) {
			callback( err );
			return console.dir( err );
		}

		var notebook = { userID : userID, title : title, tags : tags },
			notebooks = db.collection( 'notebooks' );
		notebooks.insert( notebook, { w : 1 }, function ( err, item ) {
			if ( err ) {
				db.close();
				callback( err );
				return console.dir( err );
			}

			db.close();
			callback( undefined );
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
		db.collection( 'notebooks' ).count( callback );
	} );
};


/**
 * Author : Timm Allman,
 */
exports.find = function ( str, ids, callback ) {
	var q = [ { title : { $regex : str, $options : 'i' } }, { tags : { $regex : str, $options : 'i' } } ];
	dbHelp.find( 'notebooks', q,  ids, callback );
};

exports.findByID = function ( id, callback ) {
	dbHelp.findByID( 'notebooks', id, callback );
};

/**
 * Authors : Timm Allman,
 */
exports.shareNotebook = function ( notebook, user, permissions ) {

};