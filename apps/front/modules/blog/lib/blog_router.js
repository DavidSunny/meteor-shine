BlogsListController = RouteController.extend({
  increment: 5,
  limit: function() {
    return parseInt(this.params.query.r) || this.increment;
  },
  nextPath: function() {
    this.params.query.r = this.limit() + this.increment;
    return this.route.path({}, { query: this.params.query });
  },

  findQuery: function() {
    return {}
  },
  findOptions: function() {
    return { limit: this.limit(), sort: { createdAt: -1 }}
  },

  blogs: function() {
    return Blogs.find(this.findQuery(), this.findOptions());
  },

  subscriptions: function() {
    this.subs = Meteor.subscribe('blogsList', this.findQuery(), this.findOptions());
  },

  data: function() {
    return {
      ready: this.subs.ready,
      hasMore: this.blogs().count() === this.limit(),
      blogs: this.blogs()
    };
  }

});

BlogOneController = RouteController.extend({
  /*
  increment: 1,
  limit: function() {
    return parseInt(this.params.query.r) || this.increment;
  },
  nextPath: function() {
    this.params.query.r = this.limit() + this.increment;
    return this.route.path({}, { query: this.params.query });
  },

  findQuery: function() {
    return { blogId: this.params._id };
  },
  findOptions: function() {
    return { limit: this.limit(), sort: { createdAt: -1 }};
  },

  blogComments: function() {
    return BlogComments.find(this.findQuery(), this.findOptions());
  },
*/
  blog: function() {
    return Blogs.findOne(this.params._id);
  },

  subscriptions: function() {
    Meteor.subscribe('blogOne', this.params._id);
  },

  data: function() {
    return {
//      ready: this.subs.ready,
//      hasMore: this.blogComments().count() === this.limit(),
//      blogComments: this.blogComments(),
      blog: this.blog()
    };
  }
});

MyBlogsListController = RouteController.extend({
  increment: 5,
  limit: function() {
    return parseInt(this.params.query.r) || this.increment;
  },
  nextPath: function() {
    this.params.query.r = this.limit() + this.increment;
    return this.route.path({}, { query: this.params.query });
  },


  findQuery: function() {
    return { 'author._id': Meteor.userId() }
  },
  findOptions: function() {
    return { limit: this.limit(), sort: { createdAt: -1 }}
  },

  blogs: function() {
    return Blogs.find(this.findQuery, this.findOptions());
  },

  subscriptions: function() {
    this.subs = Meteor.subscribe('myBlogsList', {}, this.findOptions());
  },

  data: function() {
    return {
      ready: this.subs.ready,
      hasMore: this.blogs().count() === this.limit(),
      blogs: this.blogs()
    };
  }
});


BlogNewController = RouteController.extend({
  subscriptions: function () {
    Meteor.subscribe('draftsList', {
      limit: Number(Session.get('draftsLimit'))
    })
  }
});

BlogEditController = RouteController.extend({
  waitOn: function() {
    Meteor.subscribe('myBlogOne', this.params._id);
  },

  data: function() {
    return {
      blog: Blogs.findOne(this.params._id)
    }
  }
});



Router.route('/blogs', {
  name: 'blogsList',
  controller: 'BlogsListController'
});

Router.route('/blog/:_id', {
  name: 'blogOne',
  controller: 'BlogOneController'
});

Router.route('/myBlogs', {
  name: 'myBlogsList',
  controller: 'MyBlogsListController'
});

Router.route('/newblog', {
  name: 'blogNew',
  controller: 'BlogNewController'
});

Router.route('/blog/:_id/edit', {
  name: 'blogEdit',
  controller: 'BlogEditController'
});


