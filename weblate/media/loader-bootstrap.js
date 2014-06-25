
function init_editor(editors) {
    editors.autosize();
}

function text_change(e) {
    if (e.key && e.key == 'Tab') {
        return;
    }
    $(this).parents('form').find('[name=fuzzy]').prop('checked', false);
}

$(function () {
    /* AJAX loading of tabs/pills */
    $(document).on('show.bs.tab', '[data-toggle="tab"][data-href], [data-toggle="pill"][data-href]', function (e) {
        var $target = $(e.target);
        var $content = $($target.attr('href'));
        if ($content.find('.panel-body').length > 0) {
            $content = $content.find('.panel-body');
        };
        $content.load(
            $target.data('href'),
            function (response, status, xhr) {
                if ( status == "error" ) {
                    var msg = gettext('Error while loading page:');
                    $content.html( msg + " "  + xhr.status + " " + xhr.statusText );
                }
            }
        );
    });

    /* Git commit tooltip */
    $(document).tooltip({
        selector: '.git-commit',
        html: true
    });

    /* Hiding spam protection field */
    $('#s_content').hide();
    $('#id_content').parent('div').hide();

    /* Form automatic submission */
    $("form.autosubmit select").change(function () {
        $("form.autosubmit").submit();
    });

    /* Row expander */
    $('.expander').click(function () {
        var $table_row = $(this).parent();
        var $next_row = $table_row.next();
        $next_row.toggle();
        var $loader = $next_row.find('tr.details .load-details');
        if ($loader.length > 0) {
            var url = $loader.attr('href');
            $loader.remove();
            $.get(
                url,
                function (data) {
                    var $cell = $next_row.find('tr.details td');
                    $cell.find('img').remove();
                    $cell.append(data);
                    $cell.find('.button').button();
                }
            );
        }
    });

    /* Priority editor */
    $('.edit-priority').click(function (e) {
        e.preventDefault();
    });

    /* Load correct tab */
    if (location.hash !== '') {
        var activeTab = $('[data-toggle=tab][href=' + location.hash + ']');
        if (activeTab.length) {
            activeTab.tab('show');
            window.scrollTo(0, 0);
        }
    }

    /* Add a hash to the URL when the user clicks on a tab */
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        history.pushState(null, null, $(this).attr('href'));
        /* Remove focus on rows */
        $('.selectable-row').removeClass('active');
    });

    /* Navigate to a tab when the history changes */
    window.addEventListener("popstate", function(e) {
        var activeTab = $('[data-toggle=tab][href=' + location.hash + ']');
        if (activeTab.length) {
            activeTab.tab('show');
        } else {
            $('.nav-tabs a:first').tab('show');
        }
    });

    /* Translation editor */
    var translation_editor = $('.translation-editor');
    if (translation_editor.length > 0) {
        $(document).on('change', '.translation-editor', text_change);
        $(document).on('keypress', '.translation-editor', text_change);
        init_editor(translation_editor);
        translation_editor.get(0).focus();
        if ($('#button-first').length > 0) {
            Mousetrap.bindGlobal('alt+end', function(e) {window.location = $('#button-end').attr('href'); return false;});
            Mousetrap.bindGlobal('alt+pagedown', function(e) {window.location = $('#button-next').attr('href'); return false;});
            Mousetrap.bindGlobal('alt+pageup', function(e) {window.location = $('#button-prev').attr('href'); return false;});
            Mousetrap.bindGlobal('alt+home', function(e) {window.location = $('#button-first').attr('href'); return false;});
            Mousetrap.bindGlobal('alt+enter', function(e) {$('.translation-form').submit(); return false;});
            Mousetrap.bindGlobal('ctrl+enter', function(e) {$('.translation-form').submit(); return false;});
        }
    }

    /* Generic tooltips */
    $('.tooltip-control').tooltip();

    /* Check ignoring */
    $('.check').bind('close.bs.alert', function () {
        var $this = $(this);
        $.get($this.data('href'));
        $this.tooltip('destroy');
    });

});
