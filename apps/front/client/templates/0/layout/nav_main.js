Template.navMain.events({

  'click [data-action=signOut]': function() {
    Meteor.logout();
  }

});
