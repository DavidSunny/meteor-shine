inlineEditor = {
  init : function (editor, title, toolbar) {
    var editor = editor;
    var title  = title;
    var toolbar = toolbar;
    var self   = this;
    console.log('Inline Editor Initiated');

    // Editor Events
    editor.addEventListener('keyup', self.events.keyup);
    editor.addEventListener('keydown', self.events.keydown);
    editor.addEventListener('click', self.events.click);
    editor.addEventListener('mouseup', function (event) {
      self.events.mouseup(editor, toolbar);
    });
    document.addEventListener('mousedown', function (event) {
      setTimeout( function () {
        if ((! $(editor).is(':focus')) && (! $(event.target).is('#editor-toolbar *'))) {
          // console.log('docuemtn editor !focus');
          // console.log(event.target);
          $(toolbar).css('top', -999);
          $(toolbar).css('left', -999);
          $(toolbar).removeClass('active');
        }
      }, 1);
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
  },

  editorToolbar: function (editor ,toolbar) {

    var selection = window.getSelection();  // Get selected Text

    var editorToolbar = toolbar;

    // If caret is collapsed (nothing is selected)
    if(selection.isCollapsed === true){
      console.log('collapse true');
      // Close Toolbar
      $(editorToolbar).css('top', -999);
      $(editorToolbar).css('left', -999);
      $(editorToolbar).removeClass('active');
    }
    // If caret is not collapsed (something is selected)
    if(selection.isCollapsed === false && $(editor).is(':focus')){
      // if( $.trim(selection.toString()).length > 0 ) {
        //if( $(editor).is(':focus') ){
          console.log('collapse false');
          var range = selection.getRangeAt(0);    // Get range from selected text
          var boundary = range.getBoundingClientRect(); // Get Boundary of range

          $(editorToolbar).css('top', boundary.top - 5 + window.pageYOffset + "px");
          $(editorToolbar).css('left', (boundary.left + boundary.right)/2 + "px");
          $(editorToolbar).addClass('active');
        //}
      // }
    }


  },

  events : {
    keyup : function (event) {
      var editor       = this;
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
  }
};
