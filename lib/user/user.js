/**
 * Created by tallman on 10/30/13.
 */
//var bcrypt = require( 'bcrypt' );
var dbHelp = require( '../../helpers/dbHelper.js' );
var mongodb = require('mongodb');

//creates a new entry in the users collection with all of the parameters as attributes, returns the userid of the new user or -1 if an error occurs trying to access the database
exports.addUser = function( fname, lname, username, email, password, callback ) {
//    MongoClient.connect('mongodb://127.0.0.1:27017/notes', function (err, db) {
    dbHelp.dbConn(function (err, db) {
        if(err){
            console.log(err);
            callback(-1);
            return;
        }
        else{
            userz = db.collection('users');
            userz.insert(
                {
                    fname: fname,
                    lname: lname,
                    username: username,
                    userid: 0,
                    email: email,
                    password: password
                },function(err, docs){
                    if(err){
                        callback(-1);
                    }
                    else{
                        userz.find({ username: username, password: password }, {_id: 1}).toArray(function (err, items) {
                            if (err){
                                callback(-1);
                                return;}
                            else {
                                var userid = items[0]['_id'];
                                userz.update(
                                    { username: username },
                                    { $set: { userid: userid } },
                                    function (err, docs) {
                                        if(err){
                                            callback(-1);
                                        }else{
                                            callback(userid);
                                        }
                                    }
                                );
                            }
                        });
                    }
                }
            );
        }
    })
};

//returns the id of the user with the provided username or -1 if an error occurs trying to access the database
exports.findUser = function( username, callback) {
//    MongoClient.connect('mongodb://127.0.0.1:27017/notes', function (err, db) {
    dbHelp.dbConn(function (err, db) {
        if(err){
            console.log(err);
            callback(-1);
            return;
        }
        else{
        userz = db.collection('users');
        userz.find({username: username}).toArray(function (err, items) {
            if (err)
                callback(-1);
            else if(!items.length){
                callback(0);
            }
            else {
                callback(items[0]['userid']);
            }
        })}
    });
};
//returns the userid if the username/password combination exists or -1 if an error occurs trying to access the database
exports.authent = function( username, password, callback ) {
 //   MongoClient.connect('mongodb://127.0.0.1:27017/notes', function (err, db) {
    dbHelp.dbConn(function (err, db) {
        if(err){
            console.log(err);
            callback(-1);
            return;
        }
        var userz = db.collection('users');
        userz.find({username: username, password: password}).toArray(function (err, items) {
            if (err)
                callback(-1);
            else if(!items.length){
                callback(0);
            }
            else {
                callback(items[0]['userid']);
            }
        });
    })
};