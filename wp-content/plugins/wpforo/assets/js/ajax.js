/* global wpforo */

$wpf.ajaxSetup({
    url: wpforo.ajax_url,
    data:{
        referer: window.location.origin + window.location.pathname
    }
});

function wpforo_post_url_fixer(hash) {
    var postid = 0;
    var match = hash.match(/^#post-(\d+)$/);
    if ( match && (postid = match[1]) ) {
        if (!$wpf(hash).length && $wpf.active === 0) {
            $wpf.ajax({
                type: 'POST',
                data: {
                    postid: postid,
                    action: 'wpforo_post_url_fixer',
                    _wpfnonce: wpforo['nonces']['wpforo_post_url_fixer'],
                }
            }).done(function (response) {
                if( /^https?:\/\/[^\r\n\t\s\0'"]+$/.test(response) ){
                    window.location.assign(response);
                }
            });
        }
    }
}

$wpf(document).ready(function ($) {
	var wpforo_wrap = $('#wpforo-wrap');

    //location hash ajax redirect fix
    setTimeout(function(){
        wpforo_post_url_fixer(window.location.hash);
    }, 500);
    window.onhashchange = function(){
        wpforo_post_url_fixer(window.location.hash);
    };

//  Reactions
    wpforo_wrap.on('click', '.wpforo-reaction .wpf-react:not(.wpf-processing)', function(){
        var $this = $( this );
        var wrap = $this.closest( '.wpf-reaction-wrap' );
        var type  = $this.data( 'type' );
        if( !type.trim() ) type = 'up';
        var postid = $this.closest( '[data-postid]' ).data('postid');

        $this.addClass( 'wpf-processing' );
        $.ajax({
            type: 'POST',
            data: {
                postid,
                type,
                action: 'wpforo_react',
                _wpfnonce: wpforo['nonces']['wpforo_react'],
            }
        }).done(function( response ){
            if( response.success ){
                $( '.reacted-users', wrap.closest( '.wpforo-post' ) ).html( response.data['likers'] );
                wrap.replaceWith( response.data['like_button'] );
            }
        }).always(function(){
            $this.removeClass( 'wpf-processing' );
        });
    });

    wpforo_wrap.on('click', '.wpforo-reaction .wpf-unreact:not(.wpf-processing)', function(){
        var $this = $( this );
        var wrap = $this.closest( '.wpf-reaction-wrap' );
        var postid = $this.closest( '[data-postid]' ).data('postid');

        $this.addClass( 'wpf-processing' );
        $.ajax({
            type: 'POST',
            data: {
                postid,
                action: 'wpforo_unreact',
                _wpfnonce: wpforo['nonces']['wpforo_unreact'],
            }
        }).done(function( response ){
            if( response.success ){
                $( '.reacted-users', wrap.closest( '.wpforo-post' ) ).html( response.data['likers'] );
                wrap.replaceWith( response.data['like_button'] );
            }
        }).always(function(){
            $this.removeClass( 'wpf-processing' );
        });
    });

//	Like
    wpforo_wrap.on('click', '.wpforo-like:not(.wpf-processing)', function () {
        wpforo_load_show();
        var postid = $(this).data('postid'),
            $this = $(this);
        $this.addClass('wpf-processing');
        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                postid: postid,
                likestatus: 1,
                action: 'wpforo_like_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_like_ajax'],
            }
        }).done(function (response) {
            if (response.success) {
                $this.find('.wpforo-like-ico').removeClass('far').addClass('fas');
                $this.find('.wpforo-like-txt').text(' ' + wpforo_phrase('Unlike'));
                $this.parents('.wpforo-post').find('.reacted-users').html(response.data.likers);
                $this.removeClass('wpforo-like').addClass('wpforo-unlike');
                if( $this.children(".wpf-like-icon").is("[wpf-tooltip]") ) {
                    $this.children(".wpf-like-icon").attr("wpf-tooltip", wpforo_phrase('Unlike') );
                }else{
                    $this.find('.wpforo-like-ico').removeClass('fa-thumbs-up').addClass('fa-thumbs-down');
                }
                $this.children(".wpf-like-count").text(response.data.count);
            }
            wpforo_load_hide();
            wpforo_notice_show(response.data.notice, (response.success ? 'success' : 'error'));
            $this.removeClass('wpf-processing');
        });
    });
// unlike
    wpforo_wrap.on('click', '.wpforo-unlike:not(.wpf-processing)', function () {
        wpforo_load_show();
        var postid = $(this).data('postid'),
            $this = $(this);
        $this.addClass('wpf-processing');
        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                postid: postid,
                likestatus: 0,
                action: 'wpforo_like_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_like_ajax'],
            }
        }).done(function (response) {
            if (response.success) {
                $this.find('.wpforo-like-ico').removeClass('fas').addClass('far');
                $this.find('.wpforo-like-txt').text(' ' + wpforo_phrase('Like'));
                $this.parents('.wpforo-post').find('.reacted-users').html(response.data.likers);
                $this.removeClass('wpforo-unlike').addClass('wpforo-like');
                if( $this.children(".wpf-like-icon").is("[wpf-tooltip]") ) {
                    $this.children(".wpf-like-icon").attr("wpf-tooltip", wpforo_phrase('Like') );
                }else{
                    $this.find('.wpforo-like-ico').removeClass('fa-thumbs-down').addClass('fa-thumbs-up');
                }
                $this.children(".wpf-like-count").text(response.data.count);
            }
            wpforo_load_hide();
            wpforo_notice_show(response.data.notice, (response.success ? 'success' : 'error'));
            $this.removeClass('wpf-processing');
        });
    });


//	Vote
    wpforo_wrap.on('click', '.wpforo-voteup:not(.wpf-processing)', function () {
        wpforo_load_show();
        var type = $(this).data('type'),
            postid = $(this).data('postid'),
            $this = $(this);
        var buttons = $('.wpforo-voteup, .wpforo-votedown', $this.closest('.wpforo-post-voting'));
        buttons.addClass('wpf-processing');
        var votestatus = ($this.hasClass('wpf-vote-active') ? 'clear' : 'up');
        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                itemtype: type,
                postid,
                votestatus,
                action: 'wpforo_vote_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_vote_ajax'],
            }
        }).done(function (response) {
            if( response.success ) {
                $this.parents('.post-wrap').find('.wpfvote-num').text(response.data.votes).fadeIn();
                var buttons_wrap = $this.closest( '.wpforo-post-voting' );
                if( buttons_wrap.length ){
                    var vote_active_buttons = $( '.wpf-vote-active', buttons_wrap );
                    if( vote_active_buttons.length ) vote_active_buttons.removeClass('wpf-vote-active');
                }
                if( votestatus !== 'clear' ) $this.addClass('wpf-vote-active');
            }
            wpforo_load_hide();
            wpforo_notice_show(response.data.notice, (response.success ? 'success' : 'error'));
            buttons.removeClass('wpf-processing');
        });
    });

    wpforo_wrap.on('click', '.wpforo-votedown:not(.wpf-processing)', function () {
        wpforo_load_show();
        var type = $(this).data('type'),
            postid = $(this).data('postid'),
            $this = $(this);
        var buttons = $('.wpforo-voteup, .wpforo-votedown', $this.closest('.wpforo-post-voting'));
        buttons.addClass('wpf-processing');
        var votestatus = ($this.hasClass('wpf-vote-active') ? 'clear' : 'down');
        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                itemtype: type,
                postid,
                votestatus,
                action: 'wpforo_vote_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_vote_ajax'],
            }
        }).done(function (response) {
            if( response.success ) {
                $this.parents('.post-wrap').find('.wpfvote-num').text(response.data.votes).fadeIn();
                var buttons_wrap = $this.closest( '.wpforo-post-voting' );
                if( buttons_wrap.length ){
                    var vote_active_buttons = $( '.wpf-vote-active', buttons_wrap );
                    if( vote_active_buttons.length ) vote_active_buttons.removeClass('wpf-vote-active');
                }
                if( votestatus !== 'clear' ) $this.addClass('wpf-vote-active');
            }
            wpforo_load_hide();
            wpforo_notice_show(response.data.notice, (response.success ? 'success' : 'error'));
            buttons.removeClass('wpf-processing');
        });
    });


//	Answer
    wpforo_wrap.on('click', '.wpf-toggle-answer:not(.wpf-processing)', function () {
        wpforo_load_show();
        var postid = $(this).data('postid'),
            $this = $(this);
        $this.addClass('wpf-processing');
        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                postid: postid,
                answerstatus: 0,
                action: 'wpforo_answer_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_answer_ajax'],
            }
        }).done(function (response) {
            if (response.success) {
                $this.removeClass('wpf-toggle-answer').addClass('wpf-toggle-not-answer');
                setTimeout(function () {
                    window.location.reload();
                }, 300);
            }
            wpforo_load_hide();
            wpforo_notice_show(response.data.notice, (response.success ? 'success' : 'error'));
            $this.removeClass('wpf-processing');
        });
    });

    wpforo_wrap.on('click', '.wpf-toggle-not-answer:not(.wpf-processing)', function () {
        wpforo_load_show();
        var postid = $(this).data('postid'),
            $this = $(this);
        $this.addClass('wpf-processing');
        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                postid: postid,
                answerstatus: 1,
                action: 'wpforo_answer_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_answer_ajax'],
            }
        }).done(function (response) {
            if (response.success) {
                $this.removeClass('wpf-toggle-not-answer').addClass('wpf-toggle-answer');
                setTimeout(function () {
                    window.location.reload();
                }, 300);
            }
            wpforo_load_hide();
            wpforo_notice_show(response.data.notice, (response.success ? 'success' : 'error'));
            $this.removeClass('wpf-processing');
        });
    });


//	Quote
    wpforo_wrap.on('click', '.wpforo-quote:not(.wpf-processing)', function () {
        wpforo_load_show();

        var $this = $(this);
        $this.addClass('wpf-processing');

        var main_form = $('form.wpforo-main-form[data-textareaid]');
        var wrap = main_form.closest('.wpf-form-wrapper');
        wrap.show();

        var post_wrap = $(this).closest('[id^=post-][data-postid]');
        var postid = post_wrap.data('postid');
        if( !postid ) postid = 0;
        $(".wpf-form-post-parentid").val( postid );
        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                postid: postid,
                action: 'wpforo_quote_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_quote_ajax'],
            }
        }).done(function (response) {
            var phrase = wpforo_phrase('Reply with quote');
            phrase = phrase.charAt(0).toUpperCase() + phrase.slice(1);
            $(".wpf-reply-form-title").html(phrase);
            $(".wpf-form-postid", main_form).val(0);

            wpforo_editor.set_content(response.data);
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
    });

//	Report
    wpforo_wrap.on('click', '.wpforo-report', function(){
        wpforo_load_show();
        var form = $("form#wpforo-report");
		$("#wpforo-report-postid", form).val( $(this).data('postid') );
        wpforo_dialog_show('', form, '45%', '295px');
        $("#wpforo-report-content", form).trigger("focus");
        wpforo_load_hide();
	});

    $(document).on('click', '#wpforo-report-send:not(.wpf-processing)', wpforo_report_send);
    $(document).on('keydown', 'form#wpforo-report', function (e) {
        if ( (e.ctrlKey || e.metaKey) && ( e.code === 'Enter' || e.code === 'NumpadEnter' ) ) {
            $('#wpforo-report-send').trigger('click');
        }
    });

    function wpforo_report_send(){
        wpforo_load_show();
        var $this = $(this);
        $this.addClass('wpf-processing');

        var postid = $('#wpforo-report-postid').val();
        var messagecontent = $('#wpforo-report-content').val();

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                postid: postid,
                reportmsg: messagecontent,
                action: 'wpforo_report_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_report_ajax'],
            }
        }).done(function (response) {
            wpforo_dialog_hide();
            $('#wpforo-report-content').val('');
            wpforo_load_hide();
            wpforo_notice_show(response.data, (response.success ? 'success' : 'error'));
            $this.removeClass('wpf-processing');
        });
    }

//	Sticky
    wpforo_wrap.on('click', '.wpforo-sticky:not(.wpf-processing)', function () {
        wpforo_load_show();
        var topicid = $(this).data('topicid'),
            $this = $(this);

        $this.addClass('wpf-processing');

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                topicid: topicid,
                status: 'sticky',
                action: 'wpforo_sticky_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_sticky_ajax'],
            }
        }).done(function (response) {
            if (response.success) {
                $this.find('.wpforo-sticky-txt').text(' ' + wpforo_phrase('Unsticky'));
                $this.removeClass('wpforo-sticky').addClass('wpforo-unsticky');
                if ($this.is("[wpf-tooltip]")) {
                    $this.attr("wpf-tooltip", wpforo_phrase('Unsticky'));
                }
            }
            wpforo_load_hide();
            wpforo_notice_show(response.data.notice, (response.success ? 'success' : 'error'));
            $this.removeClass('wpf-processing');
        });
    });


    wpforo_wrap.on('click', '.wpforo-unsticky:not(.wpf-processing)', function () {
        wpforo_load_show();
        var topicid = $(this).data('topicid'),
            $this = $(this);

        $this.addClass('wpf-processing');

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                topicid: topicid,
                status: 'unsticky',
                action: 'wpforo_sticky_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_sticky_ajax'],
            }
        }).done(function (response) {
            if (response.success) {
                $this.find('.wpforo-sticky-txt').text(' ' + wpforo_phrase('Sticky'));
                $this.removeClass('wpforo-unsticky').addClass('wpforo-sticky');
                if ($this.is("[wpf-tooltip]")) {
                    $this.attr("wpf-tooltip", wpforo_phrase('Sticky'));
                }
            }
            wpforo_load_hide();
            wpforo_notice_show(response.data.notice, (response.success ? 'success' : 'error'));
            $this.removeClass('wpf-processing');
        });
    });

//	Approve
    wpforo_wrap.on('click','.wpforo-approve:not(.wpf-processing)', function(){
        wpforo_load_show();
        var postid_value = $(this).attr('id'),
            $this = $(this);
        var postid = postid_value.replace("wpfapprove", "");

        $this.addClass('wpf-processing');

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                postid: postid,
                status: 'approve',
                action: 'wpforo_approve_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_approve_ajax'],
            }
        }).done(function (response) {
            if (response.success) {
                $("#" + postid_value).removeClass('wpforo-approve').addClass('wpforo-unapprove');
                $("#approveicon" + postid).removeClass('fa-check').addClass('fa-exclamation-circle');
                $("#wpforo-wrap #post-" + postid + " .wpf-mod-message").hide();
                $("#wpforo-wrap .wpf-status-title").hide();
                $("#approvetext" + postid).text(' ' + wpforo_phrase('Unapprove'));
                if ($this.is("[wpf-tooltip]")) {
                    $this.attr("wpf-tooltip", wpforo_phrase('Unapprove'));
                }
            }
            wpforo_load_hide();
            window.location.reload();
            $this.removeClass('wpf-processing');
        });
    });

//	Unapprove
    wpforo_wrap.on('click','.wpforo-unapprove:not(.wpf-processing)', function(){
        wpforo_load_show();
        var postid_value = $(this).attr('id'),
            $this = $(this);
        var postid = postid_value.replace("wpfapprove", "");

        $this.addClass('wpf-processing');

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                postid: postid,
                status: 'unapprove',
                action: 'wpforo_approve_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_approve_ajax'],
            }
        }).done(function (response) {
            if( response.success ){
                $("#" + postid_value).removeClass('wpforo-unapprove').addClass('wpforo-approve');
                $("#approveicon" + postid).removeClass('fa-exclamation-circle').addClass('fa-check');
                $('#wpforo-wrap #post-' + postid + ' .wpf-mod-message').visible();
                $('#wpforo-wrap .wpf-status-title').visible();
                $("#approvetext" + postid).text(' ' + wpforo_phrase('Approve'));
                if ($this.is("[wpf-tooltip]")) {
                    $this.attr("wpf-tooltip", wpforo_phrase('Approve'));
                }
            }
            wpforo_load_hide();
            window.location.reload();
            $this.removeClass('wpf-processing');
        });
    });


//	Private
	wpforo_wrap.on('click','.wpforo-private:not(.wpf-processing)', function(){
        wpforo_load_show();
		var postid_value = $(this).attr('id'),
            $this = $(this);
		var topicid = postid_value.replace("wpfprivate", "");

        $this.addClass('wpf-processing');

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                topicid: topicid,
                status: 'private',
                action: 'wpforo_private_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_private_ajax'],
            }
        }).done(function (response) {
            if( response.success ){
                $("#" + postid_value).removeClass('wpforo-private').addClass('wpforo-public');
                $("#privateicon" + topicid).removeClass('fa-eye-slash').addClass('fa-eye');
                $("#privatetext" + topicid).text(' ' + wpforo_phrase('Public'));
                if ($this.is("[wpf-tooltip]")) {
                    $this.attr("wpf-tooltip", wpforo_phrase('Public'));
                }
            }
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
	});

	wpforo_wrap.on('click','.wpforo-public:not(.wpf-processing)', function(){
        wpforo_load_show();
		var postid_value = $(this).attr('id'),
            $this = $(this);
		var topicid = postid_value.replace("wpfprivate", "");

        $this.addClass('wpf-processing');

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                topicid: topicid,
                status: 'public',
                action: 'wpforo_private_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_private_ajax'],
            }
        }).done(function (response) {
            if( response.success ){
                $("#" + postid_value).removeClass('wpforo-public').addClass('wpforo-private');
                $("#privateicon" + topicid).removeClass('fa-eye').addClass('fa-eye-slash');
                $("#privatetext" + topicid).text(' ' + wpforo_phrase('Private'));
                if ($this.is("[wpf-tooltip]")) {
                    $this.attr("wpf-tooltip", wpforo_phrase('Private'));
                }
            }
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
	});

//	Solved
	wpforo_wrap.on('click','.wpforo-solved:not(.wpf-processing)', function(){
        wpforo_load_show();
		var postid_value = $(this).attr('id'),
            $this = $(this);
		var postid = postid_value.replace("wpfsolved", "");

        $this.addClass('wpf-processing');

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                postid: postid,
                status: 'solved',
                action: 'wpforo_solved_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_solved_ajax'],
            }
        }).done(function (response) {
            if( response.success ) {
                $("#" + postid_value).removeClass('wpforo-solved').addClass('wpforo-unsolved');
                $("#solvedtext" + postid).text(' ' + wpforo_phrase('Unsolved'));
                if ($this.is("[wpf-tooltip]")) {
                    $this.attr("wpf-tooltip", wpforo_phrase('Unsolved'));
                }
            }
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
	});

	wpforo_wrap.on('click','.wpforo-unsolved:not(.wpf-processing)', function(){
        wpforo_load_show();
		var postid_value = $(this).attr('id'),
            $this = $(this);
		var postid = postid_value.replace("wpfsolved", "");

        $this.addClass('wpf-processing');

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                postid: postid,
                status: 'unsolved',
                action: 'wpforo_solved_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_solved_ajax'],
            }
        }).done(function (response) {
            if( response.success ){
                $("#" + postid_value).removeClass('wpforo-unsolved').addClass('wpforo-solved');
                $("#solvedtext" + postid).text(' ' + wpforo_phrase('Solved'));
                if ($this.is("[wpf-tooltip]")) {
                    $this.attr("wpf-tooltip", wpforo_phrase('Solved'));
                }
            }
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
	});


//	Close
	wpforo_wrap.on('click','.wpforo-close:not(.wpf-processing)', function(){
        wpforo_load_show();
		var postid_value = $(this).attr('id'),
            $this = $(this);
		var topicid = postid_value.replace("wpfclose", "");

        $this.addClass('wpf-processing');

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                topicid: topicid,
                status: 'close',
                action: 'wpforo_close_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_close_ajax'],
            }
        }).done(function (response) {
            if( response.success ){
                $("#" + postid_value).removeClass('wpforo-close').addClass('wpforo-open');
                $("#closeicon" + topicid).removeClass('fa-lock').addClass('fa-unlock');
                $("#closetext" + topicid).text(' ' + wpforo_phrase('Open'));
                if ($this.is("[wpf-tooltip]")) {
                    $this.attr("wpf-tooltip", wpforo_phrase('Open'));
                }
                $(".wpf-form-wrapper").remove();
                $(".wpforo-reply").remove();
                $(".wpforo-quote").remove();
                $(".wpforo-edit").remove();
                $(".wpf-answer-button").remove();
                $(".wpf-add-comment-button").remove();
            }
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
	});

	wpforo_wrap.on('click','.wpforo-open:not(.wpf-processing)', function(){
        wpforo_load_show();
		var postid_value = $(this).attr('id'),
            $this = $(this);
		var topicid = postid_value.replace("wpfclose", "");

        $this.addClass('wpf-processing');

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                topicid: topicid,
                status: 'closed',
                action: 'wpforo_close_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_close_ajax'],
            }
        }).done(function (response) {
            if( response.success ){
                if ($this.is("[wpf-tooltip]")) {
                    $this.attr("wpf-tooltip", wpforo_phrase('Close'));
                }
                window.location.reload();
            }
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
	});

	// Edit post
    wpforo_wrap.on('click','.wpforo-edit:not(.wpf-processing)', function(){
        var $this = $(this);
        var wrap = $(this).closest('[id^=post-][data-postid]');
        if( wrap.length ){
            $this.addClass('wpf-processing');
            var children = wrap.contents().not(":hidden");
            var loading = $('<div class="wpforo-loading-portable"><i class="fas fa-3x fa-circle-notch fa-spin"></i></div>');
            wrap.append(loading);

            var show_form = function(form, init){
                loading.remove();
                children.fadeOut('fast');
                var f = $(form);
                f.on('click', '.wpf-edit-post-cancel', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    f.fadeOut('fast');
                    children.fadeIn('slow');
                    wpforo_editor.set_active( wpforo_editor.get_main() );
                    $('html').scrollTop( (wrap.offset().top - 80) );
                });
                if( init ){
                    f.appendTo(wrap);
                    wpforo_trigger_custom_event(document, 'wpforo_topic_portable_form', f);
                }
                f.fadeIn('slow');
                $('html').scrollTop( (wrap.offset().top - 80) );
                $this.removeClass('wpf-processing');
            }

            var f = $('.wpf-form-wrapper', wrap);
            if( f.length ){
                show_form(f);
            }else{
                $.ajax({
                    type: 'POST',
                    url: wpforo.ajax_url,
                    data: {
                        postid: parseInt(wrap.data('postid')),
                        action: 'wpforo_post_edit',
                        _wpfnonce: wpforo['nonces']['wpforo_post_edit'],
                    }
                }).done(function(response){
                    if( response.success ) show_form(response.data.html, true);
                });
            }
        }
    });

//	Delete
	wpforo_wrap.on('click', '.wpforo-delete:not(.wpf-processing)', function(){
		if( confirm(wpforo_ucwords( wpforo_phrase('are you sure you want to delete?') )) ){
            wpforo_load_show();
            var $this = $(this);
		    $this.addClass('wpf-processing');

			var postid_value = $(this).attr('id');
			var is_topic = postid_value.indexOf("topic");

            var postid, status_value;
			if(is_topic === -1){
				postid = postid_value.replace("wpfreplydelete", "");
				status_value = 'reply';
			}else{
				postid = postid_value.replace("wpftopicdelete", "");
				status_value = 'topic';
			}

			var forumid = 0;
			var wpf_forumid = $("input[type='hidden'].wpf-form-forumid");
			if( wpf_forumid.length ) forumid = wpf_forumid.val();

            $.ajax({
		   		type: 'POST',
		   		url: wpforo.ajax_url,
		   		data:{
		   			forumid: forumid,
		   			postid: postid,
		   			status: status_value,
		   			action: 'wpforo_delete_ajax',
                    _wpfnonce: wpforo['nonces']['wpforo_delete_ajax'],
                }
		   	}).done(function(response){
		   		if( response.success ){
					if(is_topic === -1){
					    var to_be_removed = $('#post-' + response.data.postid);
					    if( to_be_removed.hasClass('wpf-answer-wrap') ){
                            var qa_item_wrap = to_be_removed.parents('.wpforo-qa-item-wrap');
                            if( qa_item_wrap.length ) to_be_removed = qa_item_wrap;
                        }
                        to_be_removed.remove().delay(200);
                        $('#wpf-post-replies-'+response.data.postid).remove().delay(100);
                        $('#wpf-ttgg-'+response.data.root+' .wpf-post-replies-count').text( response.data.root_count );
					}else{
						window.location.assign(response.data.location);
					}
				}
                wpforo_load_hide();
				wpforo_notice_show(response.data.notice, (response.success ? 'success' : 'error'));
                $this.removeClass('wpf-processing');
		   	});
		}
	});


//	Subscribe
	wpforo_wrap.on('click','.wpf-subscribe-forum:not(.wpf-processing), .wpf-subscribe-topic:not(.wpf-processing), .wpf-subscribe-user:not(.wpf-processing)', function(){
        wpforo_load_show();

        var $this = $(this);
        $this.addClass('wpf-processing');

        var type = $this.data('type');
        var itemid = $this.data('itemid');

        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                itemid,
                type,
                status: 'subscribe',
                action: 'wpforo_subscribe_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_subscribe_ajax'],
            }
        }).done(function (response) {
            if( response.success ){
                $this.removeClass('wpfcl-5').removeClass('wpf-subscribe-' + type).addClass('wpf-unsubscribe-' + type).text(' ' + wpforo_phrase('Unsubscribe'));
            }
            wpforo_notice_show(response.data.notice, (response.success ? 'success' : 'error'));
        }).always(function(){
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
	});

	wpforo_wrap.on('click','.wpf-unsubscribe-forum:not(.wpf-processing), .wpf-unsubscribe-topic:not(.wpf-processing), .wpf-unsubscribe-user:not(.wpf-processing)', function(){
        wpforo_load_show();

        var $this = $(this);
        $this.addClass('wpf-processing');

        var type = $this.data('type');
        var itemid = $this.data('itemid');
		var button_phrase = '';
		if( type === 'forum' ){
	    	button_phrase = wpforo_ucwords( wpforo_phrase('Subscribe for new topics') );
		}else if( type === 'topic' ){
			button_phrase = wpforo_ucwords( wpforo_phrase('Subscribe for new replies') );
		}else if( type === 'user' ){
			button_phrase = wpforo_ucwords( wpforo_phrase('Subscribe for new posts') );
		}
        $.ajax({
            type: 'POST',
            url: wpforo.ajax_url,
            data: {
                itemid,
                type,
                status: 'unsubscribe',
                action: 'wpforo_subscribe_ajax',
                _wpfnonce: wpforo['nonces']['wpforo_subscribe_ajax'],
            }
        }).done(function (response) {
            if( response.success ){
                $this.removeClass('wpf-unsubscribe-' + type).addClass('wpf-subscribe-' + type).addClass('wpfcl-5').text(' ' + button_phrase);
            }
            wpforo_notice_show(response.data.notice, (response.success ? 'success' : 'error'));
        }).always(function(){
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
	});

    wpforo_wrap.on('change', '.wpf-topic-form-forumid', function () {
        var $this = $(this);
        var form_wrap = $this.closest('.wpf-topic-form-extra-wrap');
        var form_ajax_wrap = $('.wpf-topic-form-ajax-wrap', form_wrap);
        var l = $('<i class="fas fa-spinner fa-spin wpf-icon-spinner"></i>');
        form_ajax_wrap.empty();
        l.appendTo(form_ajax_wrap);
        $this.attr('disabled', true);
        $('.wpf-topic-form-no-selected-forum', form_wrap).hide();

        var forumid = parseInt( $this.val() );
        if( forumid ){
            $.ajax({
                type: 'POST',
                data: {
                    forumid: forumid,
                    action: 'wpforo_topic_portable_form',
                    _wpfnonce: wpforo['nonces']['wpforo_topic_portable_form'],
                }
            }).done(function (response) {
                l.remove();
                if( response.success ){
                    var f = $(response.data);
                    form_ajax_wrap.empty();
                    f.appendTo(form_ajax_wrap);
                    f.fadeIn('slow');
                    wpforo_trigger_custom_event(document, 'wpforo_topic_portable_form', f);
                }
                $this.attr('disabled', false);
            })
        }
    });

	wpforo_wrap.on('click', '.wpforo-tools', function () {
	    var tools = $('#wpf_moderation_tools');
	    if( tools.is(':visible') ){
            tools.slideUp(250, 'linear');
        }else{
            wpforo_load_show();
            tools.find('.wpf-tool-tabs .wpf-tool-tab').removeClass('wpf-tt-active');
            tools.find('.wpf-tool-tabs .wpf-tool-tab:first-child').addClass('wpf-tt-active');
			wpforo_topic_tools_tab_load();
        }
    });

	wpforo_wrap.on('click', '#wpf_moderation_tools .wpf-tool-tabs .wpf-tool-tab:not(.wpf-tt-active)', function () {
        wpforo_notice_hide();
        $(this).siblings('.wpf-tool-tab').removeClass('wpf-tt-active');
        if( !$(this).hasClass('wpf-tt-active') ) $(this).addClass('wpf-tt-active');
		wpforo_topic_tools_tab_load();
    });

    wpforo_topic_tools_tab_load();

    wpforo_wrap.on('click', 'div.wpfl-4:not(.wpf-processing) .wpf-load-threads a.wpf-threads-filter', function () {
        var wrap = $(this).parents('div.wpfl-4');
        var topics_list = $('.wpf-thread-list', wrap);
        topics_list.data('paged', 0);
        topics_list.data('filter', $(this).data('filter'));
        $('.wpf-more-topics > a', wrap).trigger("click");
        $(this).siblings('a.wpf-threads-filter').removeClass('wpf-active');
        $(this).addClass('wpf-active');
    });

    wpforo_wrap.on('click', 'div.wpfl-4:not(.wpf-processing) .wpf-more-topics > a', function () {
        var $this = $(this);
        var wrap = $this.parents('div.wpfl-4');
        wrap.addClass('wpf-processing');
        var topics_list = $('.wpf-thread-list', wrap);
        var filter = topics_list.data('filter');
        var forumid = topics_list.data('forumid');
        var paged = topics_list.data('paged');
        var append = paged !== 0;
        topics_list.data('paged', ++paged);

        var load_msg = wpforo_phrase('Loading Topics');

        wpforo_load_show(load_msg);

        var i = $('.wpf-load-threads a.wpf-threads-filter[data-filter="' + filter + '"] i', wrap);
        var i_class = i.attr('class');
        var i_spin_class = 'fas fa-circle-notch fa-spin';
        var i_toggle_class = i_class + ' ' + i_spin_class;

        var i2 = $('i', $this);
        var i2_class = i2.attr('class');
        var i2_toggle_class = i2_class + ' ' + i_spin_class;

        wpforo_notice_hide();

        i.toggleClass(i_toggle_class);
        if(append) i2.toggleClass(i2_toggle_class);

        $.ajax({
            type: 'POST',
            data: {
                forumid: forumid,
                filter: filter,
                paged: paged,
                action: 'wpforo_layout4_loadmore',
                _wpfnonce: wpforo['nonces']['wpforo_layout4_loadmore'],
            }
        }).done(function (response) {
            if (response.success) {
                if (append) {
                    topics_list.append(response.data.output_html);
                } else {
                    topics_list.html(response.data.output_html);
                    $this.show();
                }
            } else {
                if (!append) {
                    topics_list.html('<span class="wpf-no-thread">' + wpforo_phrase('No threads found') + '</span>');
                }
            }

            if (response.data.no_more) {
                $this.hide();
            }

            i.toggleClass(i_toggle_class);
            if (append) i2.toggleClass(i2_toggle_class);
            wpforo_load_hide();
            wrap.removeClass('wpf-processing');
        });
    });

    wpforo_wrap.on('click', '.wpforo-qa-show-rest-comments:not(.wpf-processing)', function () {
        wpforo_load_show();
        var $this = $(this);
        $this.addClass('wpf-processing');
        var wrap = $this.parents('.wpforo-qa-item-wrap');
        var root_wrap = wrap.children('.post-wrap');
        var comments_list = $('.wpforo-qa-comments', wrap);
        var parentid = root_wrap.data('postid');
        $.ajax({
            type: 'POST',
            data: {
                parentid: parentid,
                action: 'wpforo_qa_comment_loadrest',
                _wpfnonce: wpforo['nonces']['wpforo_qa_comment_loadrest'],
            }
        }).done(function (response) {
            if (response.success) {
                comments_list.append(response.data['output_html']);
                $this.remove();
                wpforo_load_hide();
            }
            $this.removeClass('wpf-processing');
        });
    });

    wpforo_wrap.on('click', 'form[data-textareaid] .wpforo_post_preview:not(.wpf-disabled):not(.wpf-processing)', function(){
        var $this = $(this);
        var ico = $('.wpf-rev-preview-ico', $this);
        var form = $this.closest('form[data-textareaid]');

        //$('.wpforo_save_revision', form).trigger("click");

        var textareaid = form.data('textareaid');
        var postid = $( 'input.wpf-form-postid', form ).val();
        var body = wpforo_editor.get_content('raw');
        var body_info = wpforo_editor.get_stats();

        if( textareaid && body_info.has_content){
            $this.addClass('wpf-processing');
            wpforo_load_show();
            ico.toggleClass('fa-eye fa-circle-notch fa-spin');
            $.ajax({
                type: 'POST',
                data: {
                    textareaid: textareaid,
                    postid: postid,
                    body: body,
                    action: 'wpforo_post_preview',
                    _wpfnonce: wpforo['nonces']['wpforo_post_preview'],
                }
            }).done(function (response) {
                if( response.success ) {
                    $('.wpforo-revisions-action-buttons .wpforo-revision-action-button', form).removeClass('wpf-rev-button-active');
                    $this.addClass('wpf-rev-button-active');
                    $('.wpforo-revisions-preview-wrap', form).html(response.data);
                }
            }).always(function(){
                wpforo_load_hide();
                ico.toggleClass('fa-eye fa-circle-notch fa-spin');
                $this.removeClass('wpf-processing');
            });
        }

    });

    wpforo_wrap.on('click', 'form[data-textareaid] .wpforo_save_revision:not(.wpf-processing)', function () {
        var $this = $(this);
        if( $this.is(':visible') ){
            var ico = $('.wpf-rev-save-ico', $this);
            var form = $this.closest('form[data-textareaid]');
            var textareaid = form.data('textareaid');
            var postid = $( 'input.wpf-form-postid', form ).val();
            var body = wpforo_editor.get_content('raw');
            var body_info = wpforo_editor.get_stats();
            if( textareaid && body_info.has_content ){
                $this.addClass('wpf-processing');
                wpforo_load_show('Saving Draft');
                ico.toggleClass('fa-save fa-circle-notch fa-spin');
                $.ajax({
                    type: 'POST',
                    data: {
                        textareaid: textareaid,
                        postid: postid,
                        body: body,
                        action: 'wpforo_save_revision',
                        _wpfnonce: wpforo['nonces']['wpforo_save_revision'],
                    }
                }).done(function (response) {
                    if( response.success ) {
                        wpforo_deactivate_revision_action_buttons(form);
                        $('.wpf-rev-history-count', form).text(response.data.revisions_count);
                        if( response.data.revisionhtml && $('.wpforo_revisions_history', form).hasClass('wpf-rev-button-active') ){
                            var revisions_preview_wrap = $('.wpforo-revisions-preview-wrap', form);
                            revisions_preview_wrap.prepend(response.data.revisionhtml);
                            var wpforo_revision = $('.wpforo-revision', revisions_preview_wrap);
                            if( wpforo_revision.length >= wpforo.revision_options.max_drafts_per_page ){
                                wpforo_revision.each(function (i) {
                                    if( i >= wpforo.revision_options.max_drafts_per_page ) $(this).remove();
                                });
                            }
                        }
                    }
                }).always(function(){
                    wpforo_load_hide();
                    ico.toggleClass('fa-save fa-circle-notch fa-spin');
                    $this.removeClass('wpf-processing');
                });
            }
        }
    });

    wpforo_wrap.on('click', 'form[data-textareaid] .wpforo_revisions_history:not(.wpf-processing)', function(){
        var $this = $(this);
        var ico = $('.wpf-rev-ico', $this);
        var form = $this.closest('form[data-textareaid]');
        var textareaid = form.data('textareaid');
        var postid = $( 'input.wpf-form-postid', form ).val();

        if( textareaid ){
            $this.addClass('wpf-processing');
            wpforo_load_show();
            ico.toggleClass('fa-history fa-circle-notch fa-spin');
            $.ajax({
                type: 'POST',
                data: {
                    textareaid: textareaid,
                    postid: postid,
                    action: 'wpforo_get_revisions_history',
                    _wpfnonce: wpforo['nonces']['wpforo_get_revisions_history'],
                }
            }).done(function (response) {
                if( response.success ) {
                    $('.wpf-rev-history-count', form).text(response.data.revisions_count);
                    $('.wpforo-revisions-action-buttons .wpforo-revision-action-button', form).removeClass('wpf-rev-button-active');
                    $this.addClass('wpf-rev-button-active');
                    $('.wpforo-revisions-preview-wrap', form).html(response.data.revisionhtml);
                }
            }).always(function(){
                wpforo_load_hide();
                ico.toggleClass('fa-history fa-circle-notch fa-spin');
                $this.removeClass('wpf-processing');
            });
        }
    });

    wpforo_wrap.on('click', 'form[data-textareaid] .wpforo-revision-action-restore:not(.wpf-processing)', function(){
        var $this = $(this);
        var ico = $('.wpf-rev-ico', $this);
        var form = $this.closest('form[data-textareaid]');
        var rev_wrap = $this.closest('.wpforo-revision[data-revisionid]');
        if( rev_wrap.length ){
            $this.addClass('wpf-processing');
            wpforo_load_show('Restore Revision');
            ico.toggleClass('fa-history fa-circle-notch fa-spin');
            var revisionid = rev_wrap.data('revisionid');
            $.ajax({
                type: 'POST',
                data: {
                    revisionid: revisionid,
                    action: 'wpforo_get_revision',
                    _wpfnonce: wpforo['nonces']['wpforo_get_revision'],
                }
            }).done(function (response) {
                if( response.success ){
                    wpforo_editor.set_content(response.data.body);
                }
            }).always(function(){
                wpforo_load_hide();
                ico.toggleClass('fa-history fa-circle-notch fa-spin');
                $this.removeClass('wpf-processing');
            });
        }
    });

    wpforo_wrap.on('click', 'form[data-textareaid] .wpforo-revision-action-delete:not(.wpf-processing)', function(){
        var $this = $(this);
        var ico = $('.wpf-rev-ico', $this);
        var form = $this.closest('form[data-textareaid]');
        var rev_wrap = $this.closest('.wpforo-revision[data-revisionid]');
        if( rev_wrap.length ){
            $this.addClass('wpf-processing');
            wpforo_load_show('Deleting Revision');
            ico.toggleClass('fa-trash fa-circle-notch fa-spin');
            var revisionid = rev_wrap.data('revisionid');
            $.ajax({
                type: 'POST',
                data: {
                    revisionid: revisionid,
                    action: 'wpforo_delete_revision',
                    _wpfnonce: wpforo['nonces']['wpforo_delete_revision'],
                }
            }).done(function (response) {
               if( response.success ){
                   rev_wrap.fadeOut(500, function(){
                       rev_wrap.remove();
                       $('.wpf-rev-history-count', form).text(response.data.revisions_count);
                   });
               }
            }).always(function(){
                wpforo_load_hide();
                ico.toggleClass('fa-trash fa-circle-notch fa-spin');
                $this.removeClass('wpf-processing');
            });
        }
    });

    wpforo_wrap.on('click', '.wpforo-user-actions .wpf-ab-mute_mention:not(.wpf-processing)', function(){
        var $this = $(this);
        var currentstate = parseInt( $this.data('currentstate') );
        if( isNaN( currentstate ) ) currentstate = 0;
        $this.addClass('wpf-processing');
        wpforo_load_show();
        $.ajax({
            type: 'POST',
            data: {
                currentstate,
                action: 'wpforo_mute_mentions',
                _wpfnonce: wpforo['nonces']['wpforo_mute_mentions'],
            }
        }).done(function (response) {
            if (response.success) {
                $( '> i', $this ).replaceWith(response.data['ico']);
                wpforo_setAttr( $this, 'data-currentstate', response.data['currentstate'] );
                var label = $this.data( ( response.data['currentstate'] ? 'active_label' : 'inactive_label' ) )
                wpforo_setAttr( $this, 'wpf-tooltip', label );
            }
        }).always(function(){
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
    });

    wpforo_wrap.on('click', '.wpforo-user-actions .wpf-ab-ban:not(.wpf-processing)', function(){
        var $this = $(this);
        var currentstate = parseInt( $this.data('currentstate') );
        if( isNaN( currentstate ) ) currentstate = 1;
        $this.addClass('wpf-processing');
        wpforo_load_show();
        $.ajax({
            type: 'POST',
            data: {
                currentstate,
                action: 'wpforo_user_ban',
                _wpfnonce: wpforo['nonces']['wpforo_user_ban'],
            }
        }).done(function(response){
            if (response.success) {
                wpforo_setAttr( $this, 'data-currentstate', response.data['currentstate'] );
                var label = $this.data( ( response.data['currentstate'] ? 'active_label' : 'inactive_label' ) )
                wpforo_setAttr( $this, 'wpf-tooltip', label );
            }
            wpforo_notice_show( response.data['notice'] );
        }).always(function(){
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
    });

    function wpforo_activate_revision_action_buttons(form){
        var rev_saved = $('.wpforo_revision_saved', form);
        if( rev_saved.is(':visible') ){
            rev_saved.fadeOut(1000, function(){
                var save_revision = $('.wpforo_save_revision', form);
                save_revision.show();

                if( wpforo.revision_options.is_draft_on && parseInt(wpforo.revision_options.auto_draft_interval) && !save_revision.data('auto_draft') ){
                    setInterval(function(){
                        save_revision.trigger("click");
                    }, wpforo.revision_options.auto_draft_interval);
                    save_revision.data('auto_draft', true);
                }
            });
        }
    }

    function wpforo_deactivate_revision_action_buttons(form){
        $('.wpforo_revision_saved', form).show();
        $('.wpforo_save_revision', form).hide();
    }

    function wpforo_content_changed(){
        var form = $('form[data-textareaid="'+ wpforo_editor.get_active_textareaid() +'"]');
        if( wpforo_editor.get_stats().has_content ){
            wpforo_activate_revision_action_buttons(form);
            $('.wpforo_post_preview', form).removeClass('wpf-disabled');
        }else{
            wpforo_deactivate_revision_action_buttons(form);
            $('.wpforo_post_preview', form).addClass('wpf-disabled');
        }
    }

    function wpforo_content_ctrl_s(){
        $('form[data-textareaid="'+ wpforo_editor.get_active_textareaid() +'"] .wpforo_save_revision').trigger("click");
    }

    wpforo_wrap.on('change input propertychange', 'form[data-textareaid] textarea', function (e) {
        wpforo_trigger_custom_event(document,'wpforo_textarea_content_changed', e);
    });

    document.addEventListener('wpforo_tinymce_content_changed', wpforo_content_changed);
    document.addEventListener('wpforo_textarea_content_changed', wpforo_content_changed);
    document.addEventListener('wpforo_tinymce_ctrl_s', wpforo_content_ctrl_s);
    document.addEventListener('wpforo_textarea_ctrl_s', wpforo_content_ctrl_s);

    wpforo_tags_suggest();
    document.addEventListener('wpforo_topic_portable_form', function(e){
        wpforo_tags_suggest();
        window.wpforo_fix_form_data_attributes();
        var f = e.detail;
        if( f && f.length ){
            var t = $('[type="text"][required]', f);
            if( t.length && t.val().length ){
                wpforo_tinymce_initializeIt('[data-wpforoeditor="tinymce"]');
            }else{
                wpforo_tinymce_initializeIt('[data-wpforoeditor="tinymce"]', true);
                t.trigger("focus");
            }
        }
    });

    wpforo_wrap.on('click', '.wpforo-rcn-wrap .wpforo-rcn-dismiss-button:not(.wpf-processing)', function () {
        var $this = $(this);
        $this.addClass('wpf-processing');
        wpforo_load_show();
        var wrap = $(this).closest('.wpforo-rcn-wrap');
        $.ajax({
            type: 'POST',
            data: {
                backend: 0,
                action: 'wpforo_dissmiss_recaptcha_note'
            }
        }).done(function (response) {
            if( response.success ) {
                wrap.remove();
                wpforo_notice_show('done', 'success');
            }
        }).always(function () {
            wpforo_load_hide();
            $this.removeClass('wpf-processing');
        });
    });

    wpforo_wrap.on('click', '.wpf-admincp .wpf-acp-toggle:not(.wpf-processing)', function(){
        var $this = $(this);
        $this.addClass('wpf-processing');
        var wrap = $this.closest('.wpf-admincp');
        $('.wpf-acp-body', wrap).slideToggle(function(){
            $('.fas', $this).toggleClass('fa-minus-square fa-plus-square');
            var toggle_status = $(this).is(':visible') ? 'open' : 'close';
            $.ajax({
                type: 'POST',
                data:{
                    toggle_status: toggle_status,
                    action: 'wpforo_acp_toggle',
                    _wpfnonce: wpforo['nonces']['wpforo_acp_toggle'],
                }
            }).always(function(){
                $this.removeClass('wpf-processing');
            });
        });
    });

    /* -- #################################################### -- */
    /* image adjust and upload  from frontend */

    function processfile( file, max_width, max_height, quality, callback ) {
        if( !( /image/i ).test( file.type ) ) {
            alert( "File "+ file.name +" is not an image." );
            return false;
        }

        // read the files
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = function (event) {
            // blob stuff
            var blob = new Blob([event.target.result]); // create blob...
            window.URL = window.URL || window.webkitURL;
            var blobURL = window.URL.createObjectURL(blob); // and get its URL

            // helper Image object
            var image = new Image();
            image.src = blobURL;
            //preview.appendChild(image); // preview commented out, I am using the canvas instead
            image.onload = function() {
                // have to wait till it's loaded
                var resized = resizeMe(image, max_width, max_height, quality); // send it to canvas
                callback( resized );
            }
        };
    }

    // === RESIZE ====
    function resizeMe( img, max_width, max_height, quality ) {
        var canvas = document.createElement('canvas');
        var width  = img.width;
        var height = img.height;

        // calculate the width and height, constraining the proportions
        if(width > height) {
            if (width > max_width) {
                //height *= max_width / width;
                height = Math.round(height *= max_width / width);
                width = max_width;
            }
        } else {
            if (height > max_height) {
                //width *= max_height / height;
                width = Math.round(width *= max_height / height);
                height = max_height;
            }
        }

        // resize the canvas and draw the image data into it
        canvas.width  = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        return canvas.toDataURL("image/jpeg", quality); // get the data from canvas as 70% JPG (can be also PNG, etc.)
    }

    function OpenFileDialog (accept, callback) {
        // this function must be called from  a user
        // activation event (ie an onclick event)

        // Create an input element
        var inputElement = document.createElement("input");

        // Set its type to file
        inputElement.type = "file";

        // Set accept to the file types you want the user to select.
        // Include both the file extension and the mime type
        inputElement.accept = accept;

        // set onchange event to call callback when user has selected file
        inputElement.addEventListener("change", callback)

        // dispatch a click event to open the file dialog
        inputElement.dispatchEvent(new MouseEvent("click"));
    }

    wpforo_wrap.on( 'click', '.wpforo-profile .wpforo-profile-head .wpf-edit-cover:not(.wpf-processing)', function( e ){
        if( e.target.dataset['action'] === 'editcover' ){
            var options = $( '.wpf-edit-cover-options', $( this ) );
            options.css( 'display', ( options.is( ':visible' ) ? 'none' : 'flex') );
        }
    });

    wpforo_wrap.on( 'click', '.wpforo-profile .wpforo-profile-head .wpf-edit-cover .wpf-upload-cover:not(.wpf-processing)', function(){
        if ( !( window.File && window.FileReader && window.FileList && window.Blob ) ) {
            alert('The File APIs are not fully supported in this browser.');
            return false;
        }
        var that = $( this );
        that.closest( '.wpf-edit-cover-options' ).hide();
        OpenFileDialog('image/png,image/jpg,image/jpeg,image/gif', function(){
            if( this.files.length ) {
                that.addClass( 'wpf-processing' );
                wpforo_load_show('Uploading...');
                processfile(this.files[0], 1120, 460, 0.7, function (imageblob) {
                    $wpf.ajax({
                        type: 'POST',
                        data: {
                            image_blob: imageblob,
                            action: 'wpforo_profile_cover_upload',
                            _wpfnonce: wpforo['nonces']['wpforo_profile_cover_upload'],
                        }
                    }).done(function(){
                        that.closest('.wpforo-profile-head').css('background-image', 'url(\'' + imageblob + '\')');
                    }).always(function(){
                        that.removeClass('wpf-processing');
                        wpforo_load_hide();
                    });
                })
            }
        });
    });

    wpforo_wrap.on( 'click', '.wpforo-profile .wpforo-profile-head .wpf-edit-cover .wpf-delete-cover:not(.wpf-processing)', function(){
        var that = $( this );
        that.closest( '.wpf-edit-cover-options' ).hide();
        that.addClass( 'wpf-processing' );
        wpforo_load_show('Uploading...');
        $wpf.ajax({
            type: 'POST',
            data: {
                action: 'wpforo_profile_cover_delete',
                _wpfnonce: wpforo['nonces']['wpforo_profile_cover_delete'],
            }
        }).done(function( r ){
            if( r.success ) that.closest('.wpforo-profile-head').css('background-image', 'url(\'' + r.data['background_url'] + '\')');
        }).always(function(){
            that.removeClass('wpf-processing');
            wpforo_load_hide();
        });
    });

    wpforo_wrap.on( 'click', '.wpforo-profile .wpforo-follow-user:not(.wpf-processing)', function(){
        if( document.body.classList.contains( 'logged-in' ) ){
            var that   = $( this );
            var userid = parseInt( that.data('userid') );
            var stat   = !parseInt( that.data('stat') );
            that.addClass( 'wpf-processing' );
            wpforo_load_show();
            $wpf.ajax({
                type: 'POST',
                data: {
                    userid,
                    stat: ( stat ? 1 : 0 ),
                    action: 'wpforo_follow_unfollow_user',
                    _wpfnonce: wpforo['nonces']['wpforo_follow_unfollow_user'],
                }
            }).done(function( r ){
                if( r.success ){
                    that.data( 'stat', r.data['stat'] );
                    that.prop( 'stat', r.data['stat'] );
                    that.attr( 'stat', r.data['stat'] );
                    $( '.wpforo-follow-user-label', that ).text( r.data['phrase'] );
                    $( '.wpforo-follow-user-followers-count', that.closest( '.wpforo-follow-wrap' ) ).text( r.data['followers_count'] );
                }
                wpforo_notice_show( r.data['notice'], ( r.success ? 'success' : 'error' ) );
            }).always(function(){
                that.removeClass('wpf-processing');
                wpforo_load_hide();
            });
        }else{
            wpforo_notice_show( wpforo['notice']['login_or_register'] );
        }
    });

    wpforo_wrap.on('click', '.wpforo-post-head .wpf-pb-more', function(){
        var that = $( this );
        var wrap = that.closest( '.wpforo-post-head' );
        var topicid = parseInt( that.closest( '.wpforo-topic-head-wrap[data-topicid]' ).data('topicid') );

        if( ! isNaN( topicid ) && topicid ){

            that.find('span > svg').toggle();

            var more = $( '.wpf-topic-more-info', wrap );
            var already_loaded = !! more.html().trim();
            if( ! ( ! already_loaded && more.is( ':visible' ) ) ) more.toggle();

            if( ! already_loaded ){
                more.addClass( 'wpforo-section-loading' );

                $wpf.ajax({
                    type: 'POST',
                    data: {
                        topicid,
                        action: 'wpforo_get_topic_head_more_info',
                        _wpfnonce: wpforo['nonces']['wpforo_get_topic_head_more_info'],
                    }
                }).done(function( r ){
                    if( r.success ){
                        more.html( r.data['html'] );
                    }
                }).always(function(){
                    more.removeClass('wpforo-section-loading');
                });
            }

            var ico   = $( 'i.fa-chevron-up, i.fa-chevron-down', that);
            var label = $( 'span', that );
            if( more.is( ':visible' ) ){
                ico.removeClass( 'fa-chevron-down' ).addClass( 'fa-chevron-up' );
            }else{
                ico.removeClass( 'fa-chevron-up' ).addClass( 'fa-chevron-down' );
            }
        }
    });

    var topic_head_more_info = $( '.wpforo-topic-head-wrap .wpf-topic-more-info', wpforo_wrap );
    if( topic_head_more_info.is( ':visible' ) && !topic_head_more_info.html().trim() ) {
        $( '.wpforo-post-head .wpf-pb-more', wpforo_wrap ).trigger( 'click' );
    }

    wpforo_wrap.on('click', '.wpf-tmi-overview .wpf-action.wpf-topic-overview-load-more:not(.wpf-processing)', function(){
        var that       = $( this );
        var wrap       = that.closest( '.wpf-tmi-overview' );
        var tree       = $( '.wpf-topic-overview-tree', wrap );
        var nomore     = parseInt( tree.data( 'nomore' ) );
        if( ! nomore ){
            var topicid    = parseInt( that.closest( '.wpforo-topic-head-wrap[data-topicid]' ).data('topicid') );
            if( ! isNaN( topicid ) ){
                that.addClass( 'wpf-processing' );
                wpforo_load_show();

                var chunksize = parseInt( tree.data( 'chunksize' ) );
                var offset    = parseInt( tree.data( 'offset' ) );
                if( isNaN( chunksize ) ) chunksize = 5;
                if( isNaN( offset ) )    offset = 0;
                offset = offset + chunksize;

                $wpf.ajax({
                    type : 'POST',
                    data : {
                        topicid,
                        chunksize,
                        offset,
                        action: 'wpforo_get_topic_overview_chunk',
                        _wpfnonce: wpforo['nonces']['wpforo_get_topic_overview_chunk'],
                    }
                }).done(function( r ){
                    if( r.success ){
                        var nomore = r.data['nomore'] ? 1 : 0;
                        tree.append( r.data['html'] );

                        wpforo_setAttr( tree, 'data-offset', offset );
                        wpforo_setAttr( tree, 'data-chunksize', chunksize );
                        wpforo_setAttr( tree, 'data-nomore', nomore );
                    }
                }).always(function(){
                    that.removeClass('wpf-processing');
                    wpforo_load_hide();
                });
            }
        }
    });

    wpforo_wrap.on( 'click', '.wpf-tmi-overview .wpf-topic-overview-tree .wpf-tmi-item .wpf-link.wpf-tmi-item-body-excerpt:not(.wpf-processing)', function(){
        var $this = $( this );
        var postid = parseInt( $this.data( 'postid' ) );
        if( !isNaN( postid ) ){
            if( !wpforo['overview'] ) wpforo['overview'] = [];
            var overview = wpforo['overview'][postid];
            if( !overview ){
                $this.addClass( 'wpf-processing' );
                wpforo_load_show();
                $.ajax({
                    type: 'POST',
                    data: {
                        postid,
                        action: 'wpforo_get_overview',
                        _wpfnonce: wpforo['nonces']['wpforo_get_overview'],
                    }
                }).done(function( r ){
                    if( r.success ){
                        wpforo['overview'][postid] = r.data;
                        wpforo_dialog_show( r.data['title'], r.data['content'], '50%', '350px' );
                    }
                }).always(function(){
                    $this.removeClass( 'wpf-processing' );
                    wpforo_load_hide();
                });
            }else{
                wpforo_dialog_show( overview['title'], overview['content'], '50%', '350px' );
            }
        }
    } );

    wpforo_wrap.on( 'click', '.wpf-action.wpforo-bookmark:not(.wpf-processing), .wpf-action.wpforo-unbookmark:not(.wpf-processing)', {}, function(){
        var $this = $( this );
        var wrap = $this.closest( '.post-wrap[data-postid], .reply-wrap[data-postid], .comment-wrap[data-postid]' );
        if( wrap.length ){
            var postid = parseInt( wrap.data( 'postid' ) );
            if( ! isNaN( postid ) ){
                $this.addClass( 'wpf-processing' );
                var _action = ( $this.hasClass( 'wpforo-bookmark' ) ? 'wpforo_bookmark' : 'wpforo_unbookmark' );
                $.ajax( {
                    type: 'POST',
                    data: {
                        postid,
                        action: _action,
                        _wpfnonce: wpforo['nonces'][_action],
                    }
                } ).done( function( r ){
                    if( r.success ) $this.replaceWith( r.data['button'] );
                } ).always( function(){
                    $this.removeClass( 'wpf-processing' );
                } );
            }
        }
    } );

    wpforo_wrap.on( 'click', '.sbn-action .wpf-sbn-unsbscrb:not(.wpf-processing)', {}, function(){
        var $this = $( this );
        var wrap  = $this.closest( '.wpforo-sb' );
        var key = $this.data( 'key' );
        var boardid = $this.data( 'boardid' );
        if( key ){
            $this.addClass( 'wpf-processing' );
            $.ajax({
                type: 'POST',
                data: {
                    key,
                    boardid,
                    action: 'wpforo_unsubscribe',
                    _wpfnonce: wpforo['nonces']['wpforo_unsubscribe'],
                }
            }).done(function( r ){
                if( r.success ) wrap.remove();
                wpforo_notice_show( r.data['notice'], ( r.success ? 'success' : 'error' ) );
            }).always(function(){
                $this.removeClass( 'wpf-processing' );
            });
        }
    } );

    function action_get_member_template( $this, wrap, href ){
        if( $this && $this.length && wrap && wrap.length && href ){
            $this.addClass( 'wpf-processing' );
            wpforo_load_show();
            $.ajax({
                type: 'POST',
                data: {
                    href,
                    'action': 'wpforo_get_member_template',
                    _wpfnonce: wpforo['nonces']['wpforo_get_member_template'],
                }
            }).done(function( r ){
                if( r.success ){
                    $this.siblings().removeClass( 'wpf-active' );
                    $this.addClass( 'wpf-active' );
                    wrap.html( r.data['html'] );
                }
            }).always(function(){
                $this.removeClass( 'wpf-processing' );
                wpforo_load_hide();
            });
        }
    }

    wpforo_wrap.on('click', '.wpf-member-template-link.wpf-ajax-link:not(.wpf-processing)', {}, function(e){
        e.preventDefault();
        var $this = $( this );
        var wrap = $this.closest( '.wpf-profile-body' );
        var href  = e.target.href;
        action_get_member_template( $this, wrap, href );
    });

    wpforo_wrap.on('click', '.wpf-member-template-link.wpf-ajax-link .wpf-navi .wpf-navi-dropdown', {}, function(){
        this.onchange = false;
    });

    wpforo_wrap.on( 'change', '.wpf-member-template-link.wpf-ajax-link .wpf-navi .wpf-navi-dropdown', {}, function( e ){
        var $this = $( this ).closest( '.wpf-member-template-link.wpf-ajax-link' );
        var wrap  = $this.closest( '.wpf-profile-body' );
        action_get_member_template( $this, wrap, e.target.value );
    });

    let ts_input_old_value = '';
    let ts_request;
    wpforo_wrap.on('input propertychange', '.wpf-topic-create[data-suggestion="true"] form .wpf-field-name-title input[type="text"]', {}, function(){
        if( $( 'input[name=wpfaction][value=topic_add]', $(this).closest( 'form' ) ).length ){
            if( ts_request && ts_request.readyState !== 4 ) ts_request.abort();
            setTimeout( () => {
                const $this = $( this );
                let input_value = $this.val().trim();
                if( input_value.length && ts_input_old_value !== input_value ){
                    wpforo_load_show();
                    ts_request = $.ajax({
                        type: 'POST',
                        data: {
                            title: input_value,
                            action: 'wpforo_search_existed_topics',
                            _wpfnonce: wpforo['nonces']['wpforo_search_existed_topics'],
                        },
                    }).done(function(r){
                        const tlist = document.createElement('div');
                        tlist.classList.add( 'wpf-suggested-topics-list' );
                        $this.siblings( '.wpf-suggested-topics-list' ).remove();
                        $this.after( tlist );
                        if( r.success ){
                            tlist.innerHTML = '<div class="wpf-suggested-topics-title">' + wpforo_phrase('Discussions that may already have the information you are looking for') + ' &nbsp;<i class="fa-solid fa-angles-down"></i></div>';
                            r.data.forEach(function( topic ){
                                const node = document.createElement( 'div' );
                                node.classList.add( 'wpf-suggested-topic-node' );
                                node.innerHTML = `<i class="fa-solid fa-caret-right"></i>&nbsp; <a href="${topic['url']}" target="_blank">${topic['title']}</a>`;
                                tlist.append( node );
                            });
                        }
                    }).always(function(){
                        wpforo_load_hide();
                    });

                    ts_input_old_value = input_value;
                }
            }, 700);
            wpforo_load_hide();
        }
    });

    wpforo_wrap.on('focusout', '.wpf-topic-create form .wpf-field-name-title', {}, function(){
        setTimeout(function(){
            $( '.wpf-topic-create form .wpf-field-name-title .wpf-suggested-topics-list' ).remove();
        }, 100);
    });

});

function wpforo_init_phrases(){
    if( $wpf.active === 0 ) {
        $wpf.ajax({
            url: wpforo.ajax_url,
            type: 'POST',
            dataType: 'json',
            async: false,
            data: {
                action: 'wpforo_get_phrases',
                _wpfnonce: wpforo['nonces']['wpforo_get_phrases'],
            }
        }).done(function (r) {
            window.wpforo_phrases = r;
        });
    }
}

function wpforo_ucwords (str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/, function ($1) {
        return $1.toUpperCase();
    });
}

function wpforo_topic_tools_tab_load() {
    var active_tab = $wpf('#wpf_moderation_tools').find('.wpf-tool-tab.wpf-tt-active');
    if( active_tab.length ){
        var active_tab_id = active_tab.attr('id');
        if( active_tab_id && $wpf.active === 0 ){
            wpforo_notice_hide();
            $wpf('#wpf_tool_tab_content_wrap').html('<i class="fas fa-spinner fa-spin wpf-icon-spinner"></i>');
            $wpf.ajax({
                type: 'POST',
                data: {
                    active_tab_id: active_tab_id,
                    action: 'wpforo_active_tab_content_ajax',
                    _wpfnonce: wpforo['nonces']['wpforo_active_tab_content_ajax'],
                }
            }).done(function(response){
                if( response ){
                    $wpf('#wpf_tool_tab_content_wrap').html(response);
                    $wpf('#wpf_moderation_tools').slideDown(400, 'linear');
                }
                wpforo_load_hide();
            });
        }
    }
}

function wpforo_tags_suggest(){
    var wpf_tags = $wpf('.wpf-tags');
    wpf_tags.suggest(
        wpforo.ajax_url + ( /\?/.test( wpforo.ajax_url ) ? "&" : "?" ) + "action=wpforo_tag_search",
        {   multiple:true,
            multipleSep: ",",
            resultsClass: 'wpf_ac_results',
            selectClass: 'wpf_ac_over',
            matchClass: 'wpf_ac_match',
            onSelect: function() {}
        }
    );
    $wpf('.wpf_ac_results').on("blur", function() {
        wpf_tags.removeClass( 'wpf-ac-loading' );
    });
    wpf_tags.on("blur", function() {
        wpf_tags.removeClass( 'wpf-ac-loading' );
    });
    wpf_tags.on("keydown",
        function ( e ) {
            var tags = wpf_tags.val();
            if( tags.length >= 1 ){
                switch(e.code) {
                    case 'ArrowUp':  // up
                    case 'ArrowDown':  // down
                    case 'Backspace':   // backspace
                    case 'Tab':   // tab
                    case 'Enter':  // return
                    case 'NumpadEnter':  // return
                    case 'Escape':  // escape
                    case 'Space':  // space
                    case 'Comma': // comma
                        wpf_tags.removeClass( 'wpf-ac-loading' ); break;
                    default:
                        wpf_tags.addClass( 'wpf-ac-loading' );
                }
            }
            setTimeout(function() { wpf_tags.removeClass( 'wpf-ac-loading' ); }, 1000);
        }
    );
}
