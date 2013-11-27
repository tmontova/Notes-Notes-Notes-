var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;


var dbHelp = require( '../../helpers/dbHelper.js' );

exports.getSearchUsers = function (callback, query) {
  dbHelp.dbConn( function ( err, db ) {
    var users = db.collection('users');
    if (err)
      callback(err);
    else{
      users.find({$or: [
                            { fname:  {$regex: query, $options: 'i'} },
                            { lname: {$regex: query, $options: 'i'} },
                            { username: {$regex: query, $options: 'i'} },
                            { email: {$regex: query, $options: 'i'} }
                          ]}).toArray(function (err, items) {
        if (err)
          callback(err);
        else {
          callback(undefined, items);
        }
      });
    }
  });
};

exports.getEditUsers = function (callback) {
 dbHelp.dbConn( function ( err, db ) {
    var users = db.collection('notebooks');
    if (err)
      callback(err);
    else{
      users.find({title: 'title1'}).toArray(function (err, items) {
        if (err)
          callback(err);
        else {
          var send = items[0].shared;
          callback(undefined, send);
        }
      });
    }

  });
};


exports.addUserView = function(user, callback){
  var userObj = user;
  dbHelp.dbConn( function ( err, db ) {
    var users = db.collection('users');
      edit.update({userid: parseInt(id)}, {$set: {edit: false}}, function (err, docs) {
        callback(err, docs);
      });
      var user = users.find({userid: parseInt(id)}).toArray();
      edit.insert(user, function(err, docs){
        callback(err, docs);
      });
  });
}

exports.addUser = function(user, callback){
  var userObj = user;
  dbHelp.dbConn( function ( err, db ) {
      var edit = db.collection('edit');
      edit.insert(user, function(err, docs){
        callback(err, docs);
      });
  });
}

exports.getUserbyID = function(id, callback){
  dbHelp.dbConn( function ( err, db ) {
    var users = db.collection('users');
    if (err)
      callback(err);
    else{
      users.find({_id: id}).toArray(function (err, items) {
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

exports.canEditChange = function (id, callback) {
dbHelp.dbConn( function ( err, db ) {
    var notebooks = db.collection('notebooks');
    if (err)
      callback(err);
    else{
    //  users.update({_id: id}, {$set: {edit: true}}, function (err, docs) {
        notebooks.update({shared: {_id:id, edit: false}}, {$set: {shared: {_id: id, edit: true}}}, function(err, docs){
        //find notebook by id

        callback(err, docs);
      });
    }
  });
}

  exports.canViewChange = function (id, callback) {
    dbHelp.dbConn( function ( err, db ) {
    var notebooks = db.collection('notebooks');
    if (err)
      callback(err);
    else{
      console.log(id);
      console.log(notebooks.find({title: 'title1'}).toArray());
      //users.update({_id: parseInt(id)}, {$set: {edit: false}}, function (err, docs) {
       notebooks.update({shared: {_id:id, edit: true}}, {$set: {shared: {_id: id, edit: false}}}, function(err, docs){

        callback(err, docs);
      });
    }
  });
}
