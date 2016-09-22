import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';


// set Session variable in method callback
Tracker.autorun( function() {
  Meteor.call('tasks.find', false, function(error, result){
    Session.set('tasksFindResult', result);
  });
});
// set Session variable in method callback
Tracker.autorun( function() {
  Meteor.call('tasks.find', true, function(error, result){
    Session.set('tasksCompletedResult', result);
  });
});
Tracker.autorun( function() {
  Meteor.call('tasks.count', function(error, result){
    Session.set('tasksCountResult', result);
  });
});

Template.body.helpers({
  tasks() {
    return Session.get('tasksFindResult');
  },
  tasksCompleted() {
    return Session.get('tasksCompletedResult');
  },
  incompleteCount() {
    return Session.get('tasksCountResult');
  }
});

Template.body.events({
  'submit .new-task'(event) {
    event.preventDefault();

    const target = event.target;
    const text = target.text.value;

    Meteor.call('tasks.insert', text);

    target.text.value = '';
  },
});
