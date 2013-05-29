$(function() {
    
    // retrieve the settings from chrome.storage.sync and execute our stuff
    // in the callback function. 
    chrome.storage.sync.get(null, function(items) {

        // iterate posts and check for the settings inside
        $("tr[username]").each(function(index, element) {
            var el = $(element);
            
            // display post counter?
            if(items['post_counter']) 
                showPostCounter(el, index);

            // hide users?
            if(items['hidden_users'].length !== 0)
                hideUsers(el, items['hidden_users']);
            
        });
        
        // hide things
        if(items['hide_header'])
            hideHeader();
        
        if(items['hide_ads'])
            hideInthreadAds();
        
        if(items['quick_reply'])
            enableQuickReply();
    });

    
    
});

/**
 * Shows a small counter next to each post in the thread view
 * @param  {jquery element} tr_element
 * @param  {index of the post on the page} index
 */
function showPostCounter(tr_element, index) {
    $(document.createElement('span'))
        .addClass('postcounter').text("["+(index+1)+"]")
        .insertAfter(tr_element.next().find(".postlink"));
}

/**
 * Hides user posts specified in the options
 * @param  {jquery element} tr_element
 * @param  {array of hidden user names} hidden_users
 */
function hideUsers(tr_element, hidden_users) {
    if(document.URL.indexOf("thread.php") === -1)
        return;
    var username = tr_element.attr("username");

    if($.inArray(username, hidden_users) >= 0) {
        var indicator = $(document.createElement('tr'))
            .addClass("color3 hidden_user")
            .html(
                $(document.createElement('td'))
                    .attr("colspan", "2")
                    .html('Hidden Post by <strong>' + username + '</strong>')
            ).click(function() {
                $(this).hide().prev().show().prev().show();
            });
        
        tr_element.hide().next().hide().after(indicator);
    }
}

/**
 * Hides the header above the bookmarks.
 */
function hideHeader() {
    $("#mdeleiste").hide();
    $("#adnet_top").hide().next().find("table.std").hide();
}

/**
 * Hides the in-thread advertisement
 */
function hideInthreadAds() {
    if(document.URL.indexOf("thread.php") === -1)
        return;
    $("tr.color3:not([username]):not(.hidden_user)").hide().next().hide();
}

function enableQuickReply() {
    if(document.URL.indexOf("thread.php") === -1)
        return;

    chrome.extension.sendRequest({cmd: "quick_reply"}, function(html){
        var doc_object;

        // create, modify and insert the form
        var form = $(html);
        form.insertBefore($("form[action^='thread.php']")).hide();

        // first, get the xml of the document.
        var xml_url = document.URL.replace("bb/", "bb/xml/");
        $.get(xml_url, function(data) {
            doc_object = $(data);

            var newreply_token = doc_object.find("token-newreply").attr('value');
            var thread_id = doc_object.find("thread").attr("id");

            form.find("input[name='token']").val(newreply_token);
            form.find("input[name='TID']").val(thread_id);

            form.show();

            // add click listeners to the quote buttons
            $("a[href*='newreply.php?PID']").click(function(e) {
                e.preventDefault();

                var pid_pattern = /PID=(\d+)/;
                var pid = pid_pattern.exec($(this).attr("href"))[1];

                // find the post content, author
                var post = doc_object.find("post[id='" + pid + "']");
                var quote_text = post.find("content").text();
                var quote_author = post.find("user").text();
                form.find("textarea").focus().append("[quote=" + thread_id + "," + pid +
                    ",\"" + quote_author + "\"][b]\n" + quote_text + "\n[/b][/quote]\n");
                
            });

        }, "xml");

        
    });
}