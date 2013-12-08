var dbHelp = require( '../../helpers/dbHelper.js' );

exports.getUserbyID = function(id, callback){
  dbHelp.dbConn( function ( err, db ) {
    var users = db.collection('users');
    if (err)
      callback(err);
    else{
      users.findOne({_id: id}, function (err, items) {
        if (err)
          callback(err);
        else {
          callback(undefined, items);
        }
      });
    }
  });
}

exports.deleteUser = function (id, callback) {
  dbHelp.dbConn( function ( err, db ) {
    var edit = db.collection('edit');
    if (err)
      callback(err);
    else{
      edit.remove({userid: parseInt(id)}, function (err, docs) {
      callback(err, docs);
      });
    }
  });
};

  exports.changePermission = function (obj, callback) {
    //changes users permission from edit to view only
    var userID = obj.id;
    var permission = obj.permission;
    console.log(userID);
    console.log(permission);

    dbHelp.dbConn( function ( err, db ) {
    var notebooks = db.collection('notebooks');
    if (err)
      callback(err);
    else{

       notebooks.update(
                          {'shared.with': userID}, {title: 'title1'},                        //using title1 as a placeholder because I don't know where I'm getting notebook title, cookies?
                         {$set: {'shared.edit': permission}}, function(err, docs){
        callback(err, docs);
      });
    }
  });
}


exports.addUser = function(user, callback){
  //add user to the notebooks shared array, with editing permission
  var userObj = user;
  dbHelp.dbConn( function ( err, db ) {

  });
}
