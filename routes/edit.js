/**
 * Created by tallman on 10/28/13.
 */
var note = require('../lib/note');


exports.view = function(req, res) {
	
	res.render( 'view-note', {id : req.params.id} );
}

exports.edit = function(req, res) {
	res.render( 'notetaking', {id : req.params.id, loginPage : "edit"} );
}

exports.getNote = function(req, res) {
	var id;
	if(req.body){
		id = req.body._id;
	}
	note.getNote(id, function(err, item){
		if(err)
			console.error("db failed: " + err);
		else{
			res.contentType('application/json');
			res.send(item);
		}
	});

};

exports.update = function(req, res) {
	var doc;
	if(req.body){
		doc = req.body.doc;
	}
		note.updateDoc(doc, function(error, item){
			if(error)
				console.error("db failed: " + error);
			else{
				res.contentType('application/json');
				res.send(item);
			}
		});
}