

$(function() {

    var bool_preferences = {
        "post_counter": "Show the post number.",
        "hide_header": "Hide headers.",
        "hide_ads": "Hide in-thread advertisement.",
        "quick_reply": "Show the quick reply box.",
        "quick_edit": "Use the quick edit functionality."
    }

    var status = $("#status");

    // restore options
    chrome.storage.sync.get(null, function(items) {

        // print and restore the checkboxes for boolean settings
        var template = $(".template.checkbox_setting");
        $.each(bool_preferences, function(index, value) {
            var setting_dom = template.clone().removeClass("template");
            setting_dom.find("label").attr("for", index).text(value);
            setting_dom.find("input").attr("id", index).prop('checked', items[index]);
            setting_dom.insertAfter(template);
        });

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

        // set the boolean settings
        $.each(bool_preferences, function(index, value) {
            settings[index] = $("#"+index).is(":checked");
        });

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