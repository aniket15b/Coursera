const bcrypt = require('bcrypt');

var express=require("express");
var connection = require('../config/config');
var info = require('../config/info');

module.exports.login = function(req, res){

  connection.query('SELECT * from ? WHERE email=?', info.databse, req.body.email, function(error,results,fields){
      if(error){
        res.json({
          status: false,
          message: error
        });
      } else {
        if(results.length>0){
          if(bcrypt.compareSync(req.body.password,results[0].password)){
            var user = {
              email: req.body.email
            }
            req.session.loggedin = true;
            req.session.email = user.email;
            res.json({
              status: true,
              message: "Login Successful"
            });
          } else {
            res.json({
              status: false,
              message: "Invalid password"
            });
          }
        } else {
          res.json({
            status: false,
            message: "Invalid email"
          });
        }
      }
  });


}
