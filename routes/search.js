/**
 * Created by tallman on 10/28/13.
 */

var Note = require( '../lib/note' );
var Notebook = require( '../lib/notebook' );

exports.searchAll = function ( req, res ) {
	var q = req.query.q,
		query = [ { title : q }, { tags : q } ],
		user = req.session.user;

	Note.find( query, [ { userID : user._id }, { 'shared.with' : user._id } ], function ( results ) {
		var noteResults = results;

		Notebook.find( query, [ { userID : user._id }, { 'shared.with' : user._id } ], function ( results ) {
			results = results.concat( noteResults );

			results.sort( function ( a, b ) {
				if ( a.title == b.title ) {
					return 0;
				} else if ( a.title < b.title ) {
					return -1;
				} else {
					return 1;
				}
			} );

			res.render( 'search', {
				title : 'Search All',
				query : q,
				results : results,
				signedInUser : user,
				search : true
			} );
		} );
	} );
};

exports.searchNotebook = function ( req, res ) {
	var query = req.query.q;

	Notebook.findByID( req.params.id, function ( err, notebook ) {
		Note.find( query, [ { notebookID : notebook._id } ], function ( results ) {
			res.render( 'search', {
				title : 'Search All',
				query : query,
				results : results,
				selectedNotebook : notebook
			} );
		} );
	} );
};