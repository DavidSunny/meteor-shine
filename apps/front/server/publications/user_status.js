Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true }, { });
});

Meteor.publish("authorProfile", function() {
  return Meteor.users.find({}, {"profile.avatarUrl": 1 });
});
