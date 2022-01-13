// reference all the elements
let quickDownloadCheckbox = $("#enable-quick-download")
let preferredVersionRow = $("#qd-preferred-version-row")
let preferredVersionInput = $("#qd-preferred-version")
let tabId = null
let quickDownload = null;
let preferredVersion = null;

// check if is on the correct page
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    let url = tabs[0].url;

    $("#loading").addClass("d-none");
    if (!url.startsWith("https://www.curseforge.com/")) {
        $("#invalid-page").removeClass("d-none");
        return;
    } else {
        $("#root").removeClass("d-none");
    }

    tabId = tabs[0].id;

    // add events
    quickDownloadCheckbox.on("change", function (e) {
        e.preventDefault()
        toggleQuickDownload(quickDownloadCheckbox.is(":checked"))
    });

    preferredVersionInput.on("change", function (e) {
        e.preventDefault()
        changePreferredVersion(preferredVersionInput.val())
    });

    // initialize from chrome storage
    chrome.storage.local.get(["quickDownload", "preferredVersion"], function (result) {
        quickDownload = result.quickDownload;
        preferredVersion = result.preferredVersion;
        toggleQuickDownload(quickDownload)
        changePreferredVersion(preferredVersion)
    });

});

function toggleQuickDownload(value) {
    quickDownload = value;
    chrome.storage.local.set({
        "quickDownload": value
    });

    if (value) {
        quickDownloadCheckbox.prop("checked", true)
        preferredVersionRow.removeClass("d-none")
    } else {
        preferredVersionRow.addClass("d-none")
    }

    chrome.tabs.sendMessage(tabId, {quickDownload: quickDownload, preferredVersion: preferredVersion});
}

function changePreferredVersion(value) {
    preferredVersion = value;
    chrome.storage.local.set({
        "preferredVersion": value
    });

    preferredVersionInput.val(value);

    chrome.tabs.sendMessage(tabId, {quickDownload: quickDownload, preferredVersion: preferredVersion});
}
