import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
  'tasks.find'(getCompleted) {
    check(getCompleted, Boolean);

    if(getCompleted) {
      return Tasks.find({ owner: this.userId, checked: true }, { sort: { createdAt: -1 } }).fetch();
    }
    return Tasks.find({ owner: this.userId, checked: { $ne: true } }, { sort: { createdAt: -1 }}).fetch();
  },
  'tasks.count'() {
    return Tasks.find({ owner: this.userId, checked: { $ne: true } }).count();
  },
  'tasks.insert'(text) {
    check(text, String);

    if(!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'tasks.remove'(taskId) {
    // check(taskId, String);

    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    Tasks.update(taskId, { $set: { checked: setChecked } });
  }
});
