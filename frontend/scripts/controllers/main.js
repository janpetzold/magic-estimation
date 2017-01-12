'use strict';

/**
 * Core controller for magic estimation app. Currently handles everything since "business logic" is fairly simple.
 */
angular.module('me').controller('MainCtrl', function ($scope, $http) {
    var vm = this;

    vm.host = '';
    vm.sprints = [];
    vm.tasks = [];
    vm.participants = [];
    vm.selectedParticipant = null;
    vm.sum = 0;

    vm.selectSprint = function (sprint) {
        console.log("Selected sprint " + sprint);
        vm.tasks = resetTouchedAttribute(getIssuesForSprint(sprint));
    };

    vm.addParticipant = function (participant) {
        if (vm.participants.indexOf(participant) === -1) {
            vm.participants.push(participant);
        }
        vm.selectedParticipant = vm.participants[0];
    };

    vm.removeParticipant = function (participant) {
        vm.participants = vm.participants.filter(function (value) {
            return value !== participant;
        });
    };
    
    vm.selectParticipant = function() {
        for(var i = 0; i < vm.participants.length; i++) {
            if(vm.participants[i] === vm.selectedParticipant) {
                if(i < vm.participants.length - 1) {
                    vm.selectedParticipant = vm.participants[i + 1];
                } else {
                    vm.selectedParticipant = vm.participants[0]
                }
                break;
            }
        }
    };

    vm.getIconForTask = function (type) {
        if (type === 'Story') {
            return 'images/story.svg';
        } else if (type === 'Task' || type === 'Aufgabe') {
            return 'images/task.svg';
        } else if (type === 'Verbesserung' || type === 'Improvement') {
            return 'images/improvement.svg';
        } else if (type === 'Erweiterung' || type === 'Feature') {
            return 'images/feature.svg';
        } else {
            return 'images/bug.svg';
        }
    };

    $scope.$on('bag-one.drop', function (event, element, target) {
        console.log('Moved element ' + element[0].id);

        var currentTask = getTaskById(element[0].id);
        if (currentTask !== null) {
            currentTask.value = parseInt(target[0].dataset.sp, 10);
            currentTask.touched++;
            $scope.$apply();
        }

        calculateSumOfStoryPoints();
    });

    var getIssuesForSprint = function (name) {
        for (var i = 0; i < vm.sprints.length; i++) {
            if (vm.sprints[i].name === name) {
                return vm.sprints[i].issues;
            }
        }
        return null;
    };

    var resetTouchedAttribute = function (tasks) {
        for (var i = 0; i < tasks.length; i++) {
            tasks[i].touched = 0;
        }
        return tasks;
    };

    var getTaskById = function (id) {
        for (var i = 0; i < vm.tasks.length; i++) {
            if (vm.tasks[i].id === id) {
                return vm.tasks[i];
            }
        }
        return null;
    };

    var calculateSumOfStoryPoints = function() {
        vm.sum = 0;
        for (var i = 0; i < vm.tasks.length; i++) {
            vm.sum = vm.sum + vm.tasks[i].value;
        }
        $scope.$apply();
    };

    var init = function () {
        // get config
        $http.get('/config').success(function (config) {
            vm.host = config.jira.host;
        });

        // fetch all sprints and tasks from backend
        $http.get('/sprints').success(function (sprintData) {
            vm.sprints = sprintData;
            vm.tasks = sprintData[0].issues;
        }).error(function () {
            alert('Could not read sprint data from backend.');
        });
    };

    init();

});
