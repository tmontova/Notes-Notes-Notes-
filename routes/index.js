
person = {name:"bob Johnson", canEdit: true, email: 'bjonson@email.com'};		// start test Data
person2 = {name:'rick johnson', canEdit: false, email: 'rickyj@email.com'};
person3 = {name:'jfasd fasdf', canEdit:true, email: 'jfadddd@gmail.com'};
var testArrayShared = new Array(person, person2, person3);							//end test data
var testArraySearch = new Array();
var testArrayEdit = new Array();



exports.share = function(req, res){
	//generate shared on all pages, search should be under scripts when submit is hit
	var testArraySearch = new Array();
	var testArrayEdit = new Array();

	res.render('share', { username: 'Dynamic username', item_to_share: 'Dynamic filename', searchResults: testArraySearch, shared: testArrayShared, edit: testArrayEdit});
};

exports.search = function(req, res){
		var testArrayEdit = new Array();
 var x=req.params.x;
 	console.log(x);
	testArraySearch = new Array (person, person2, person3);

	res.render('share', { username: 'Dynamic username', item_to_share: 'Dynamic filename', searchResults: testArraySearch, shared: testArrayShared, edit: testArrayEdit});

};
exports.edit = function(req, res){
	var testArraySearch = new Array();
	testArrayEdit = testArrayShared;

	res.render('share', { username: 'Dynamic username', item_to_share: 'Dynamic filename', searchResults: testArraySearch, shared: testArrayShared, edit: testArrayEdit});

}

// exports.userlist = function(db) {
// //  // db.open(function(err,db){

//  //      db.collection('post',function(err,collection){

//  //        collection.find().each(function(err,posts){
//  //          if(!err){
//  //          res.json(posts);
//  //          }
//  //        });

//  //     });


//  // });


//  //        res.render('userlist', {username: 'username'});
//     };
