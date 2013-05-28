$(function() {
    
    chrome.storage.sync.get(null, function(items) {

        // iterate posts and check for the settings inside
        $("tr[username]").each(function(index, element) {
            var el = $(element);
            
            // display post counter?
            if(items['post_counter']) {
                var counter_span = $(document.createElement('span'))
                                .addClass('postcounter').text("["+(index+1)+"]");
                counter_span.insertAfter(el.next().find(".postlink"));
            }

            // hide users?
            if($.inArray(el.attr("username"), items['hidden_users']) >= 0) {
                var indicator = $('<tr class="color3 hidden_user">\
                    <td colspan="2">Hidden Post by <strong>' + el.attr("username") + '</strong>.\
                    Click to show.</td></tr>');
                el.hide().next().hide().after(indicator);
            }
            
        });
        
        // hide things
        if(items['hide_header']) {
            $("#mdeleiste").hide();
            $("#adnet_top").hide().next().find("table.std").hide();
        }

        if(items['hide_ads']) {
            $("tr.color3:not([username]):not(.hidden_user)").hide().next().hide();
        }
        
    });



    // other functionality

    // show hidden post
    $(document).on("click", ".hidden_user", function() {
        $(this).hide().prev().show().prev().show();
    });
    

});