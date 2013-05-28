

$(function() {
    var status = $("#status");

    // restore options
    chrome.storage.sync.get(null, function(items) {
        $("#post_counter").prop('checked', items['post_counter']);
        $("#hide_header").prop('checked', items['hide_header']);
        $("#hide_ads").prop('checked', items['hide_ads']);

        // hidden users
        if(items['hidden_users'])
            $.each(items['hidden_users'], function(index, value) {
                var row = $('<li class="hidden_user"><span>'+ value +'</span> <a href="#">x</a></li>');
                $("#hidden_users").append(row);
            });
    });

    // save options
    $("#save").click(function() {
        var settings = {};

        settings['post_counter'] = $("#post_counter").is(":checked");
        settings['hide_header'] = $("#hide_header").is(":checked");
        settings['hide_ads'] = $("#hide_ads").is(":checked");

        // find users to hide
        settings['hidden_users'] = [];
        $(".hidden_user span").each(function() {
            settings['hidden_users'].push($(this).text());
        });

        chrome.storage.sync.set(settings, function() {
            status.text("Saved!");
        });
    });

    // the code for the user hiding stuff
    $("#add_hidden_user").click(function() {
        var username = $("#add_hidden_user_text").val().trim();
        if(username.length > 0) {
            var row = $('<li class="hidden_user"><span>'+ username +'</span> <a href="#">x</a></li>');
            $("#hidden_users").append(row);
            $("#add_hidden_user_text").val("");
        }
    });

    $(document).on("click", ".hidden_user a", function(e) {
        e.preventDefault();
        $(this).parent().remove();
    });
});