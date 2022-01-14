// check if is on the correct page
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    let url = tabs[0].url;

    $("#loading").addClass("d-none");
    if (url && url.startsWith("https://www.curseforge.com/")) {
        $("#root").removeClass("d-none");
    } else {
        $("#invalid-page").removeClass("d-none");
        return;
    }
});


/// PAYPAL
PayPal.Donation.Button({
    env:'production',
    hosted_button_id:'GXFF6K2EHWVZW',
    image: {
        src:'https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif',
        alt:'Donate with PayPal button',
        title:'PayPal - The safer, easier way to pay online!',
    }
}).render('#donate-button');
