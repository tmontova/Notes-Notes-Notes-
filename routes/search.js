/**
 * Created by tallman on 10/28/13.
 */

var note = require( '../lib/note' );
var notebook = require( '../lib/notebook' );

exports.searchAll = function( req, res ) {
	var query = req.query.q;

	note.find( query, undefined, function( results, db ) {
		var noteResults = results;
		var noteDb = db;

		notebook.find( query, undefined, function( results, db ) {
			results = results.concat(noteResults);

			results.sort( function( a, b ) {
				if ( a.title == b.title ) {
					return 0;
				} else if ( a.title < b.title ) {
					return -1;
				} else {
					return 1;
				}
			} );

			res.render( 'search all', {
				title : 'Search All',
				query : query,
				results : results
			} );

			db.close();
			noteDb.close();
		} );
	} );
};

exports.searchNotebook = function( req, res ) {

};