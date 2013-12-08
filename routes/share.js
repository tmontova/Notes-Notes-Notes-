var share_database = require( '../lib/share_database' ),
	User = require( '../lib/user' ),
	Notebook = require( '../lib/notebook' );

exports.share = function ( req, res ) {						//base page, empty results area
	Notebook.findByID( "529f859950733dfaa60c60ff", function ( err, item ) {
		if ( err ) {
			console.error( 'db failed: ' + err );
		} else {
			res.render( 'share', {
				title : 'Share',
				username : req.session.user.fname,
				item_to_share : item.title,
				shared: item.shared
			} );
		}
	} );
};

exports.search = function ( req, res ) {					//base page + search data returned in results area
	var q = req.query.q;

	User.find( q, function ( err, userlist ) {
		if ( err ) {
			console.error( 'db failed: ' + err );
		} else {
			res.send( userlist );
		}
	} );
};

exports.addUser = function ( req, res ) {

	if ( req.body ) {
		var obj = req.body.data;

		share_database.addUser( obj, function ( err, docs ) {
			if ( err ) {
				console.error( 'db failed: ' + err );
			}
			else {
				res.send( docs );
			}
		});
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
				res.send( [] );
			}
		} );

	}
}

exports.changePermission = function ( req, res ) {
	if ( req.body ) {
		var obj = req.body.data;
		share_database.canViewChange( obj, function ( err, docs ) {
			if ( err ) {
				console.error( 'db failed: ' + err );
			}
			else {
				res.send( [] );
			}
		} );
	}
}

exports.edit = function ( req, res ) {						//base page + edit Shared Users returned in results area
	Notebook.findByID( "529f859950733dfaa60c60ff", function ( err, item ) {
		if ( err ) {
			console.error( 'db failed: ' + err );
		} else {
			res.render( 'share', {
				title : 'Share',
				username : req.session.user.fname,
				item_to_share : item.title,
				shared: item.shared
			} );
		}
	} );

	share_database.getEditUsers( function ( err, userlist ) {
		if ( err ) {
			console.error( 'db failed: ' + err );
		}
		else {
			share_database.getUserbyID(userlist.with, function(err, users){
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