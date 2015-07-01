Template.postView.onCreated(function() {
  var instance = this;
  var data;

  instance.increment = 5;
  instance.limit = new ReactiveVar(instance.increment);
  instance.loaded = new ReactiveVar(0);

  instance.editMode = new ReactiveVar(false);
  instance.setEditMode = function(edit) {
    instance.$('.post-title').attr('contenteditable', edit);
    instance.$('.post-content').attr('contenteditable', edit);
    instance.editMode.set(edit);

    if (edit) {
      instance.$('.post-content').focus();
    }
  };

  instance.autorun(function() {
    data = Template.currentData();

    var limit = instance.limit.get();

    instance.subscribe('postView', data.postId);

    instance.subscribe('postCommentsList', { postId: data.postId },
      { limit: limit, sort: { createdAt: 1 }});
  });

  instance.post = function() {
    return Posts.findOne(data.postId);
  };

  instance.commentsCount = function() {
    return Counts.get('postCommentsListCount', { postId: data.postId });
  };

  instance.comments = function() {
    return PostComments.find({ postId: data.postId },
      { limit: instance.loaded.get(), sort: { createdAt: 1 }});
  };
});

Template.postView.onDestroyed(function() {
  this.limit = null;
  this.loaded = null;
  this.editMode = null;
  this.post = null;
  this.commentsCount = null;
  this.comments = null;
});

Template.postView.helpers({
  post: function() {
    return Template.instance().post();
  },

  commentsCount: function() {
    return Template.instance().commentsCount();
  },

  comments: function() {
    return Template.instance().comments();
  },

  isEditMode: function() {
    return Template.instance().editMode.get();
  },

  titleEditable: function() {
    var post = Template.instance().post();
    return '<h3 id="title" class="post-title" contenteditable="false">' +
      ((post) ? post.title : '') + '</h3>';
  },

  contentEditable: function() {
    var post = Template.instance().post();
    return '<div id="content" class="post-content" contenteditable="false">' +
      ((post) ? post.content : '') + '</div>';
  }
});


Template.postView.events({
  'click #edit': function(e, instance) {
    instance.setEditMode(true);
  },

  'click #delete': function(e, instance) {
    e.preventDefault();

    var self = this;

    Alerts.dialog('confirm', 'delete?', function(confirm) {
      if (confirm) {
        Meteor.call('postRemove', self.postId, function(error, result) {
          if (error) {
            Alerts.notify('error', error.message);
          } else {
            Alerts.notify('success', 'post_remove_success');
            history.go(-1);
          }
        });
      }
    });
  },

  'click #save': function(e, instance) {
    e.preventDefault();

    var object = {
      title: instance.$('#title').html(),
      content: instance.$('#content').html(),
    };

    if (! object.content) {
      Alerts.notify('error', 'input content');
      return;
    }

    Meteor.call('postUpdate', this.postId, object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'post_insert_success');
        instance.setEditMode(false);
      }
    });
  },

  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  }
});