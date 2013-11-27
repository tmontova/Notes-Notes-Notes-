function seedUsers() {
	db.users.insert( [
		{ "fname" : "Timm", "lname" : "Allman", "username" : "tallman", "email" : "tallman@umass.edu", "password" : "tallman" },
		{ "fname" : "Nicholas", "lname" : "Combs", "username" : "ncombs", "email" : "ncombs@umass.edu", "password" : "ncombs" },
		{ "fname" : "Thomas", "lname" : "Montovani", "username" : "tmontova", "email" : "tmontova@umass.edu", "password" : "tmontova" },
		{ "fname" : "Christopher", "lname" : "Peterson", "username" : "crpeters", "email" : "crpeters@umass.edu", "password" : "crpeters" },
		{ "fname" : "Patrick", "lname" : "Broughton", "username" : "pbrought", "email" : "pbrought@umass.edu", "password" : "pbrought" }
	] );
}

function seedNotebooks() {
	var userC = db.users.count(),
		users = db.users.find();
	for ( var i = 0; i < userC * 3; i++ ) {
		var userId = users[i % userC]._id;
		db.notebooks.insert( { userId : userId, title : 'title' + i, tags : [ 'tag' + i ] } );
	}
}

function shareNotebooks() {
	var userC = db.users.count() - 1,
		users = db.users.find();
	for ( var i = 0; i <= userC; i++ ) {
		var userId = users[i]._id;
		db.notebooks.update( { userId : userId }, { $push : { shared : { with : users[ userC - i ]._id, edit : true } } } );
	}
}

function seedNotes() {
	var notebookC = db.notebooks.count(),
		notebooks = db.notebooks.find();
	for ( var i = 0; i < notebookC * 3; i++ ) {
		var notebook = notebooks[i % notebookC];
		db.notes.insert( { userId : notebook.userId, notebookId : notebook._id, title : 'title' + i, tags : [ 'tag' + i ], note : 'note' + i } );
	}
}

function shareNotes() {
	var userC = db.users.count() - 1,
		users = db.users.find();
	for ( var i = 0; i <= userC; i++ ) {
		var userId = users[i]._id;
		db.notes.update( { userId : userId }, { $push : { shared : { with : users[ userC - i ]._id, edit : true } } } );
	}
}

function seedDb() {
	db.users.drop();
	db.notes.drop();
	db.notebooks.drop();

	seedUsers();
	seedNotebooks();
	seedNotes();
	shareNotebooks();
	shareNotes();
}

seedDb();

