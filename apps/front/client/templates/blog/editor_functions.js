/**
 * inlineEditor
 * (Medium Clone)
 * created by Sang Yoo Kim (sangyoo.km@gmail.com)
 */

inlineEditor = {
  init : function (editor, title, toolbar) {
    self    = this;

    editor  = editor;
    title   = title;
    toolbar = toolbar;

    console.log('Inline Editor Initiated');

    // Editor Events
    editor.addEventListener('keyup', function () {
      self.events.keyup(editor, toolbar);
    });
    editor.addEventListener('keydown', function () {
      self.events.keydown;
    });
    editor.addEventListener('click', function () {
      self.events.click;
    });
    editor.addEventListener('mouseup', function (event) {
      self.events.mouseup(editor, toolbar);
    });

    // Title Events
    title.addEventListener('keydown', self.events.titleKeydown);

    // Paste
    title.addEventListener('paste', self.events.handlepaste);
    editor.addEventListener('paste', self.events.handlepaste);

    // Title Placeholders
    title.addEventListener('blur', self.events.titleBlur, true);
    title.addEventListener('focus', self.events.titleFocus, true);

    // Editor Placeholders
    editor.addEventListener('blur', self.events.editorBlur, true);
    editor.addEventListener('focus', self.events.editorFocus, true);

    // Toolbar
    // Editor Toolbar Buttons (a#editor-x)
    toolbar.addEventListener('click', function (event) {
      self.toolbarEvents(toolbar);
    });

    $(window).on('resize', function () {
      var selection = window.getSelection();  // Get selected Text
      if (selection.isCollapsed === false) {
        console.log('collapse false');
        console.log(toolbar);
        var range = selection.getRangeAt(0);    // Get range from selected text
        var boundary = range.getBoundingClientRect(); // Get Boundary of range
        $(toolbar).css('top', boundary.top - 5 + window.pageYOffset + "px");
        $(toolbar).css('left', (boundary.left + boundary.right)/2 + "px");
      }
    });

    // Editor mousedown to Turn off Highlight Toolbar
    document.addEventListener('mousedown', function (event) {
      setTimeout( function () {
        if ((! $(editor).is(':focus')) && (! $(event.target).is('#editor-toolbar *'))) {
          // console.log('docuemtn editor !focus');
          // console.log(event.target);
          self.toolbarHide(toolbar);
        }
      }, 1);
      $('p').addClass('shine-p');
    });
  },



  events : {
    keyup : function (editor, toolbar) {
      //var editor       = this;
      var keycode      = event.keyCode || event.which;
      var focusNode    = window.getSelection().focusNode;
      var selectedNode = $.trim($(focusNode).text()).length;

      $(editor).data('default', false);
      // console.log($(editor).data('default'));

      // onEnter
      if (keycode === 13) {
        document.execCommand('formatBlock', false, 'p');
        var shineP = window.getSelection().focusNode;
        $(shineP).addClass("shine-p");
      };

      // Add 'editor-empty' if P is empty
      if (focusNode && (selectedNode > 0)) {
        $(focusNode.parentNode).removeClass('shine-empty');
      } else {
        $(focusNode).addClass('shine-empty');
      };

      //is Selected
      if ($(editor).is(':focus') && editor.hasChildNodes()) {
        var childNodes = editor.childNodes; // Array of childe nodes
        if (childNodes && $(focusNode).hasClass('shine-empty')) {
          $(childNodes).removeClass('is-selected');
          $(focusNode).addClass('is-selected');
        } else {
          $(childNodes).removeClass('is-selected');
          $(focusNode.parentNode).addClass('is-selected');
        }
      }

      inlineEditor.editorToolbar(editor, toolbar);

      $('p').addClass('shine-p');
    },

    keydown: function (event) {
      var editor       = this;
      var keycode      = event.keyCode || event.which;

      // Prevent Backspace
      var dNode = 'P' || 'H3';

      if ((keycode === 8)                        &&
          (editor.childNodes.length === 1)       &&
          (!editor.textContent.length)           &&
          (editor.firstChild.nodeName === dNode)) {
        console.log('Prevent Backspace Conditions met');
        event.preventDefault();
        event.stopPropagation();
        return false;
      };

      if (keycode === 9) {
        // Space for Tab;
      };
    },

    mouseup: function (editor, toolbar) {
      // console.log('hello, Im mouse up');
      // console.log(toolbar);
      setTimeout( function () {
        inlineEditor.editorToolbar(editor, toolbar);
      }, 1);
      $('p').addClass('shine-p');
    },

    titleKeydown: function (event) {
      var keycode      = event.keyCode || event.which;

      if (keycode === 13) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    },

    click: function (event) {
      var editor    = this;
      var focusNode = window.getSelection().focusNode;

      //is Selected
      if ($(editor).is(':focus') && editor.hasChildNodes()) {
        var childNodes = editor.childNodes; // Array of childe nodes
        if (childNodes && $(focusNode).hasClass('shine-empty')) {
          $(childNodes).removeClass('is-selected');
          $(focusNode).addClass('is-selected');
        } else {
          $(childNodes).removeClass('is-selected');
          $(focusNode.parentNode).addClass('is-selected');
        }
      }
    },

    handlepaste : function (event) {
      document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
      event.preventDefault();
    },

    titleBlur : function (event) {
      var titleLength = $.trim($(event.target).text()).length;

      if (titleLength === 0) {
        $(event.target).append('제목');
        $(event.target).data('default', true);
      } else {
        $(event.target).data('default', false);
      }
    },

    titleFocus : function (event) {
      if ( $(event.target).data('default') === true ) {
        $(event.target).empty();
        // $(event.target).data('default', false);
      } else {

      }
    },

    editorBlur : function (event) {
      // var editorLength = $.trim($(event.target).text()).length;

      // if (editorLength === 0) {
      //   $(event.target).append('<p class="shine-p is-selected">본문</p>');
      //   $(event.target).data('default', true);
      // } else {
      //   $(event.target).data('default', false);
      // }
    },

    editorFocus : function (event) {
      // if ( $(event.target).data('default') === true ) {
      //   $(event.target).empty();
      //   $(event.target).append('<p class="shine-p is-selected"> </p>')
      // } else {

      // }
    },
  }, // End Events

  toolbarEvents: function () {
    tryTarget = function (button) {
      // Added @tryTarget because `event.target` could be either
      // the anchor tag itself, or the icon inside the anchor
      var target = $(event.target);
      if (target.parent().is(button)) {
        return true;
      } else if (target.is(button)) {
        return true;
      } else {
        return false;
      }
    };

    var targetEl = window.getSelection().focusNode.parentNode;

    if (tryTarget($('#editor-bold'))) {
      document.execCommand('bold', false, true);
    }
    if (tryTarget($('#editor-italic'))) {
      document.execCommand('italic', false, true);
    }
    if (tryTarget($('#editor-heading'))) {
      console.log(window.getSelection().focusNode.parentNode.nodeName)
      if (window.getSelection().focusNode.parentNode.nodeName === 'H3') {
        document.execCommand('formatBlock', false, 'p');
        $('p').addClass('shine-p');
      } else {
        document.execCommand('formatBlock', false, '<h3>');
        $('h3').addClass('shine-h3');
      }
    }
    if (tryTarget($('#editor-center'))) {
      //document.execCommand('justifyCenter', false, true);
      console.log(targetEl);
      if( $(targetEl).css('text-align') === 'center' ) {
        document.execCommand('justifyLeft', false, true);
      } else {
        document.execCommand('justifyCenter', false, true);
      }
    }
  },

  editorToolbar: function (editor ,toolbar) {

    var selection = window.getSelection();  // Get selected Text

    var editorToolbar = toolbar;

    // If caret is collapsed (nothing is selected)
    if (selection.isCollapsed === true) {
      console.log('collapse true');
      // Close Toolbar
      $(editorToolbar).css('top', -999);
      $(editorToolbar).css('left', -999);
      $(editorToolbar).removeClass('active');
    }
    // If caret is not collapsed (something is selected)
    if (selection.isCollapsed === false && $(editor).is(':focus')) {
      console.log('collapse false');
      var range = selection.getRangeAt(0);    // Get range from selected text
      var boundary = range.getBoundingClientRect(); // Get Boundary of range

      $(editorToolbar).css('top', boundary.top - 5 + window.pageYOffset + "px");
      $(editorToolbar).css('left', (boundary.left + boundary.right)/2 + "px");
      $(editorToolbar).addClass('active');
    }
  },

  toolbarHide : function (toolbar) {
    $(toolbar).css('top', -999);
    $(toolbar).css('left', -999);
    $(toolbar).removeClass('active');
  },

};
