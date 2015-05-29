/**
 * Display user information
 *    - picture
 *    - profile
 */

var TEMPLATE_PROFILE = 'templateProfile';
var EDIT_PASSWORD = 'editPassword';

Template.profileView.helpers({
  getAvatarUrl: function() {
    var user = Meteor.user();
    if(user && user.profile) return user.profile.avatarUrl
  },

  templateProfile: function() {
    return Session.get(TEMPLATE_PROFILE) || 'profileEditNormal';
  },

  editPassword: function() {
    return Session.get(EDIT_PASSWORD) || false;
  }

});

Template.profileView.events({

  "click #editPicture": function() {
    // set Cropperjs's options
    // Default crop box data property setting
    // return String (e.g 400px)
    // $('.avatar-wrapper').css('width');

    var user = Meteor.user();

    var cropBoxData = {};
    var canvasData = {};

    cropBoxData.width = 270;
    cropBoxData.height = 270;

    if(user && user.profile.position) {
      canvasData.left = user.profile.position.left;
      canvasData.top = user.profile.position.top;
      canvasData.width = user.profile.position.width;
      canvasData.height = user.profile.position.height;

      var rotateValue = user.profile.position.rotate;
    }

    // $().cropper(options);
    // $.fn.cropper.setDefaults(options).

    $('#avatarPreview').cropper({
      aspectRatio: 1/1,
      autoCropArea: 1,
      strict: false,
      responsive: false,
      background: false,
      highlight: false,
      dragCrop: false,
      movable: false,
      resizable: false,
      preview: '.avatar-preview',
      built: function() {
        // Strict mode: set crop box data first
        $('#avatarPreview').cropper('setCropBoxData', cropBoxData);
        if(user && user.profile.position) {
          $('#avatarPreview').cropper('setCanvasData', canvasData);
          $('#avatarPreview').cropper('rotate', rotateValue);
        }
      },
    });

    console.log('canvasData: ', canvasData);

    $('#profileModal').modal('show');
  },

  'click #editProfile': function() {
    var template = Session.get(TEMPLATE_PROFILE);
    if (template === 'profileEditForm')
      Session.set(TEMPLATE_PROFILE, 'profileEditNormal');
    else
      Session.set(TEMPLATE_PROFILE, 'profileEditForm');
  },

  'click #editPassword': function() {
    var edit = Session.get(EDIT_PASSWORD);
    Session.set(EDIT_PASSWORD, ! edit);
  }
});

Template.profileView.onRendered(function() {
  $('#profileModal').on('hidden.bs.modal', function () {
    $('#avatarPreview').cropper('destroy');
  });
});

