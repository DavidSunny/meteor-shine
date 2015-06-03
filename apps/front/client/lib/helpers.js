Template.registerHelper('activeRoute', function(/* route names */) {
	var args = Array.prototype.slice.call(arguments, 0);
	args.pop();

	var active = _.any(args, function(name) {
		return Router.current() && Router.current().route.getName() === name
	});

	return active && 'active';
});

Template.registerHelper('userEmail', function () {
    var user = Meteor.user();
    if (user && user.emails) {
      return user.emails[0].address;
    }
});

Template.registerHelper('getAvatarUrl', function () {
  var user = Meteor.user();

  if (user && user.profile) {
    return user.profile.avatarUrl
  }
});

Template.registerHelper('getAvatarAuthor', function () {
  var authorId = this.user._id;
  var author = Meteor.users.findOne({_id: authorId});

  if (author && author.profile) {
    return author.profile.avatarUrl
  }
});
