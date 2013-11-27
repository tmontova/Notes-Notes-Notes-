/**
 * Created by tallman on 10/28/13.
 */
/**
 * Created by tallman on 10/28/13.
 */
var username;
var nb = "Physics";
var notebook = require( '../lib/notebook' );
var note= require( '../lib/note' );


exports.notebookHome = function(req, res){

notebook.listThem(function( results, db){
	var noteResults = results;
	var noteDB = db;

			results.sort( function( a, b ) {
				if ( a.title == b.title ) {
					return 0;
				} else if ( a.title < b.title ) {
					return -1;
				} else {
					return 1;
				}
			} );

			res.render( 'home', {
				username : username,
				title: 'Home Screen',
				results : results,
				results2: noteResults
			} );

			db.close();
			noteDB.close();
		} );
	
};

exports.snb = function(req, res){
note.listThem(function( results, db){
	var noteResults = results;
	var noteDB = db;
		results.sort( function( a, b ) {
				if ( a.title == b.title ) {
					return 0;
				} else if ( a.title < b.title ) {
					return -1;
				} else {
					return 1;
				}
			} );
	res.render( 'selectednotebook', {
				title: nb + ' Notebook',
				notebook : nb ,
				results : results
		
			} );
		db.close();
			noteDB.close();


});
}
	
