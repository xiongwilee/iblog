define(['zepto', 'reveal', 'head', 'marked', 'highlight'],
  function($, Reveal, head, marked, highlight) {

    function postDetail() {
      this.$postMarkdown = $('#postMarkdown');
      this.$postContainer = $('#postContainer');
      this.$commentsListContainer = $('#postCommentsList');
      this.$commentsFormContainer = $('#postCommentsForm');
      this.marked = this.setMarked();

      this.init();
    }

    postDetail.prototype = {
      init: function() {
        this.markdown = this.$postMarkdown.val();
        this.html = this.marked(this.markdown);
        this.issues_id = window.CONSTANT.issues_id;
      },
      setMarked: function() {
        // Synchronous highlighting with highlight.js
        marked.setOptions({
          highlight: function(code) {
            return hljs.highlightAuto(code).value;
          }
        });
        return marked;
      },
      render: function() {
        this.renderPost();
        this.renderCommentsList();
        this.renderCommentsForm();
      },
      renderPost: function() {
        this.$postContainer.html(this.html);
      },
      renderCommentsForm: function() {
        var me = this;

        $.get('/post/commentsform', {
          href: window.location.href,
          html_url: window.CONSTANT.html_url
        }, function(html) {
          me.$commentsFormContainer.html(html);

          me.$postCommentsForm = me.$commentsFormContainer.children('.post-comments-form');
          me.$postCommentsFormItem = me.$postCommentsForm.find('.comments-form');
          me.$postCommentsFormText = me.$postCommentsFormItem.find('.comments-form-textarea');
          me.$postCommentsFormLoading = me.$postCommentsFormItem.find('.comment-form-bottom-loading');

          me.bindCommentsFormEvent();
        });

      },
      bindCommentsFormEvent: function() {
        var me = this;

        me.postCommentsFlag = false;
        me.$postCommentsFormItem.on('submit', function(evt) {
          evt.preventDefault();

          var commentsText = me.$postCommentsFormText.val();
          if (!commentsText || me.postCommentsFlag) return;

          me.postCommentsFlag = true;
          me.$postCommentsFormLoading.show()

          $.ajax({
            type: 'POST',
            url: '/api/comments/create',
            contentType: 'application/json',
            data: JSON.stringify({
              issues_id: me.issues_id,
              body: commentsText
            }),
            success: function(data) {
              me.postCommentsFlag = false;
              me.$postCommentsFormLoading.hide();

              me.$postCommentsFormText.val('');
              me.renderCommentsList();
            },
            error: function() {
              me.postCommentsFlag = false;
              me.$postCommentsFormLoading.hide()
            }
          });
        })

        me.$postCommentsFormText.on('focus', function(evt) {
          me.$postCommentsFormItem.addClass('focus');
        })

        me.$postCommentsFormText.on('blur', function(evt) {
          me.$postCommentsFormItem.removeClass('focus');
        })
      },
      renderCommentsList: function(data) {
        var me = this;

        data = data || {};

        $.get('/post/commentslist/' + this.issues_id, {
          page: data.page || 1
        }, function(html) {
          me.$commentsListContainer.html(html);

          me.$postCommentsList = me.$commentsListContainer.children('.post-comments-list');

          me.setCommentsListDefault();
          me.bindCommentsListEvent();
        });
      },
      setCommentsListDefault: function() {
        var me = this;

        var $commentsContentList = me.$postCommentsList.find('.comments-detail-content');

        for (var i = 0; i < $commentsContentList.length; i++) {
          var $commentsContent = $($commentsContentList[i]);
          var markdown = $commentsContent.children('.comments-detail-markdown').val();

          $commentsContent.html(me.marked(markdown))
        }
      },
      bindCommentsListEvent: function() {
        var me = this;

        me.loadingPageFlag = false;
        me.$postCommentsList.on('click', '.page-item-change', function(evt) {
          evt.preventDefault();

          if (me.loadingPageFlag) return;

          me.loadingPageFlag = true;
          $(this).children('.page-icon-loading').show();
          $(this).children('.page-icon-arrow').hide();

          me.renderCommentsList({
            page: $(this).data('page')
          });
        });

        me.$postCommentsList.on('click', '.comments-detail-replay', function(evt) {
          evt.preventDefault();

          var replyText = '@' + $(this).data('user') + ' ';
          if (me.$postCommentsFormText && me.$postCommentsFormText.length > 0) {
            var formText = me.$postCommentsFormText.val();
            if (formText.indexOf(replyText) !== 0) {
              me.$postCommentsFormText.val(replyText + formText);
            }
            me.$postCommentsFormText.focus();
          }else{
            alert('Please Login!');
            window.location.href = "#commentsLogin";
          }
        });
      },
      setDefault: function() {

      }
    }

    return postDetail;
  });
