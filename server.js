var express = require('express');
var config = require('config');
var jira = require('./backend/jira');

var app = express();

app.get('/config', function (req, res) {
    res.send(config);
});

app.get('/sprints', function (req, res) {
    // query JIRA API for sprint data
    jira.getSprintsAndIssues().then(function(issues) {
        console.log('Promise resolved');
        console.dir(issues, {depth:9} );
        res.send(issues);
    });
});

app.use("/", express.static('frontend'));
app.use("/libs", express.static('node_modules'));

app.listen(3000, function () {
    console.log('Magic estimation server app listening on port 3000');
});
