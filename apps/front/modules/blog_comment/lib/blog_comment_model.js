/**
 * BlogComments
 *    _id
 *    msg                 String 1..200
 *    user                Object { _id, username, name }
 *    createdAt           Date
 *
 * @type {Mongo.Collection}
 */
BlogComments = new Mongo.Collection('blog_comments');

Meteor.methods({

  blogCommentInsert: function(object) {
    // validate
    var validation = BlogCommentValidator.validateInsert(object);
    if (validation.errors().length > 0) {
      throw new Meteor.Error(ERROR_CODE_MATCH, "error_validation_fail");
    }

    // check permission
    if (! this.userId) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");
    }

    // make input object
    var now = new Date();
    var user = Meteor.user();

    var comment = {
      blogId: object.blogId,
      msg: object.msg,
      user: {
        _id: user._id,
        username: user.username
        //name: user.name
      },
      createdAt: now,
      updatedAt: now
    };

    // write to database
    comment._id = BlogComments.insert(comment);

    // push notification
    createCommentNotification(comment);

    return comment._id;

  }
});
