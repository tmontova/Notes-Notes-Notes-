var bcrypt = require( 'bcrypt' ),
	dbHelp = require( '../../helpers/dbHelper.js' );

/**
 * creates a new entry in the users collection with all of the parameters as attributes
 * calls callback with _id of created user, null if a user with that username or email already exists. or the error that occurred
 * Authors: Timm Allman,
 */
exports.add = function ( fname, lname, email, password, callback ) {
	'use strict';
	dbHelp.dbConn( function ( err, db ) {
		if ( err ) {
			db.close();
			callback( err );
			return console.dir( err );
		}

		var hash = bcrypt.hashSync( password, 10 ),
			user = { fname : fname, lname : lname, email : email, pHash : hash },
			users = db.collection( 'users' );

		users.find( { email : email }, function ( err, docs ) {
			if ( err ) {
				db.close();
				callback( err );
				return console.dir( err );
			}

			if ( docs.length > 0 ) {
				db.close();
				callback( undefined, null );
			} else {
				users.insert( user, { w : 1 }, function ( err, user ) {
					if ( err ) {
						db.close();
						callback( err );
						return console.dir( err );
					}

					callback( undefined, user._id );
					db.close();
				} );
			}
		} );
	} );
};

/**
 * calls callback with an object representing the user with username and password if such a user exists
 * otherwise calls callback with null or the error that occured
 * Authors: Timm Allman,
 */
exports.auth = function ( email, password, callback ) {
	'use strict';
	dbHelp.dbConn( function ( err, db ) {
		if ( err ) {
			callback( err );
			return console.dir( err );
		}

		var users = db.collection( 'users' );
		users.findOne( { email : email }, function ( err, doc ) {
			if ( err ) {
				db.close();
				callback( err );
			} else if ( doc === null ) {
				db.close();
				callback( undefined, null );
			} else {
				if ( !bcrypt.compareSync( password, doc.pHash ) ) {
					callback( undefined, null );
					db.close();
				} else {
					callback( undefined, doc._id );
					db.close();
				}
			}
		} );
	} );
};

/**
 * calls callback with an object with the user name username if one exists
 * otherwise calls callback with null or the error that occurred
 * Authors: Timm Allman,
 */
exports.findOne = function ( query, callback ) {
	'use strict';
	dbHelp.dbConn( function ( err, db ) {
		if ( err ) {
			db.close();
			callback( err );
			return console.dir( err );
		}

		var users = db.collection( 'users' );
		users.findOne( {
				$or : [
					{ fname : query },
					{ lname : query },
					{ email : query }
				]
			}, function ( err, doc ) {
				if ( err ) {
					db.close();
					callback( err );
					return console.dir( err );
				}

				db.close();
				callback( undefined, doc );
			}
		);
	} );
};

/**
 * calls callback with an array of user objects with user names that include username as a substring
 * or the error that occurred
 * Authors: Timm Allman,
 */
exports.find = function ( query, callback ) {
	'use strict';
	dbHelp.dbConn( function ( err, db ) {
		if ( err ) {
			callback( err );
			return console.dir( err );
		}

		var users = db.collection( 'users' );
		users
			.find( {
				$or : [
					{ fname : { $regex : query, $options : 'i' } },
					{ lname : { $regex : query, $options : 'i' } },
					{ email : { $regex : query, $options : 'i' } }
				]
			} )
			.toArray( function ( err, docs ) {
				if ( err ) {
					callback( err );
					return console.dir( err );
				}

				callback( undefined, docs );
			} );
	} );
};