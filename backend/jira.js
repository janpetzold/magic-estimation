/**
 * This module queries the JIRA API in two steps:
 *
 * 1. determine current and future sprints
 * 2. based on the sprint ID determine all tickets for the sprint
 *
 * The result contains all tickets, their summary and type for each sprint
 */

var request = require('request');
var config = require('config');

/**
 * Get all sprints for current board
 * @param resolve
 */
var getSprints = function(resolve) {
    request({
        url: 'https://' +  config.get('jira.username') + ':' +  config.get('jira.password') + '@' + config.get('jira.host') + '/rest/agile/latest/board/' + config.get('jira.board') + '/sprint?state=active,future'
    }, function(error, response, body) {
        var allSprints = JSON.parse(body).values;
        var result = [];

        for(var i = 0; i < allSprints.length; i++) {
            console.log("Retrieved sprint " + allSprints[i].id + " that is named " + allSprints[i].name);
            result.push({
                'id': allSprints[i].id,
                'name' : allSprints[i].name
            });
        }

        getIssues(result, resolve);
    });
};

/**
 * Get all issues for current sprint
 *
 * @param sprints
 * @param resolve
 */
var getIssues = function(sprints, resolve) {
    var sprintResolvedCounter = 0;

    for(var i = 0; i < sprints.length; i++) {
        request({
            url: 'https://' +  config.get('jira.username') + ':' +  config.get('jira.password') + '@' + config.get('jira.host') + '/rest/api/latest/search?jql=Sprint=' + sprints[i].id
        }, function(error, response, body) {
            sprintResolvedCounter++;

            var allIssuesForSprint = JSON.parse(body);
            var currentSprintId = this.path.split('Sprint=')[1];

            console.log("Found " + allIssuesForSprint.length + " issues for sprint " + currentSprintId);

            for(var i = 0; i < sprints.length; i++) {
                if(sprints[i].id === parseInt(currentSprintId, 10)) {
                    sprints[i] = getDetailsForIssues(sprints[i], allIssuesForSprint);
                }
            }

            if(sprintResolvedCounter >= sprints.length) {
                resolve(sprints);
            }
        });
    }
};

/**
 * Get information on issues in current allIssues
 * 
 * @param sprint
 * @param issues
 * @returns {*}
 */
var getDetailsForIssues = function(sprint, issues) {
    sprint.issues = [];

    for(var j = 0; j < issues.issues.length; j++) {
        sprint['issues'].push({
            'id': issues.issues[j].key,
            'type': issues.issues[j].fields.issuetype.name,
            'name': issues.issues[j].fields.summary,
            'value': 0
        });
    }

    return sprint;
};

exports.getSprintsAndIssues = function(){
    return new Promise(function(resolve) {
        getSprints(resolve);
    });
};