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
            
    });



    // other functionality

    // show hidden post
    /*$(document).on("click", ".hidden_user", function() {
        $(this).hide().prev().show().prev().show();
    });*/
    
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
    if(document.URL.indexOf("thread.php") !== -1)
        $("tr.color3:not([username]):not(.hidden_user)").hide().next().hide();
}