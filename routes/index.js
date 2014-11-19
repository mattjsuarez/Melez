var express = require('express');
var jade = require('jade');
var router = express.Router();
//Needed to read file in from the server file system
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//Get the newsletter page - routing
router.get('/newsletter.html', function(req, res) {
  res.render('newsletter', { title: 'The Updated Times'});
});
module.exports = router;