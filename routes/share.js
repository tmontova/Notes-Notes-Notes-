var share_database = require( '../lib/share_database' );

exports.share = function ( req, res ) {						//base page, empty results area

	share_database.getEditUsers( function ( err, userlist ) {
		if ( err ) {
			console.error( 'db failed: ' + err );
		}
		else {
			res.render( 'share', {
				username : 'Dynamic username',
				item_to_share : 'Dynamic filename',
				shared : userlist
			} );
		}
	} );
};

exports.search = function ( req, res ) {					//base page + search data returned in results area

	if ( req.body ) {
		var data = req.body;

		share_database.getSearchUsers( function ( err, userlist ) {
			if ( err ) {
				console.error( 'db failed: ' + err );
			}
			else {
				res.send( userlist );
			}
		}, data.data );
	}
};

exports.addUser = function ( req, res ) {

	if ( req.body ) {
		var userID = req.body.data;
		share_database.getUserbyID( userID, function ( err, user ) {

			if ( err ) {
				console.error( 'db failed: ' + err );
			}
			else {
				share_database.addUser( user, function ( err, docs ) {

					if ( err ) {
						console.error( 'db failed: ' + err );
					}
					else {
						res.send( docs );
					}
				} );
			}
		} );

	}
}

exports.deleteUser = function ( req, res ) {

	if ( req.body ) {
		var userID = req.body.data;

		share_database.deleteUser( userID, function ( err, docs ) {
			if ( err ) {
				console.error( 'db failed: ' + err );
			}
			else {
				res.send( new Array() );
			}
		} );

	}
}
exports.canEditChange = function ( req, res ) {
	if ( req.body ) {
		var userID = req.body.data;
		share_database.canEditChange( userID, function ( err, docs ) {
			if ( err ) {
				console.error( 'db failed: ' + err );
			}
			else {
				res.send( new Array() );
			}
		} );
	}
}
exports.canViewChange = function ( req, res ) {
	if ( req.body ) {
		var userID = req.body.data;
		share_database.canViewChange( userID, function ( err, docs ) {
			if ( err ) {
				console.error( 'db failed: ' + err );
			}
			else {
				res.send( new Array() );
			}
		} );
	}
}

exports.edit = function ( req, res ) {						//base page + edit Shared Users returned in results area

	share_database.getEditUsers( function ( err, userlist ) {
		if ( err ) {
			console.error( 'db failed: ' + err );
		}
		else {
			share_database.getUserbyID(userlist[0].with, function(err, users){
				if(err)
					callback(err);
				else{
					var obj = {userInfo: users, editInfo: userlist};
					res.send(obj);
				}
			});
		}
	}, '' );
};