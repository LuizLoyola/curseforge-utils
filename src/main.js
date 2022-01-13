function fastRecentFilesDownload() {
    $('div.cf-recentfiles-credits-wrapper').each(function (i) {
        let btn = $(this);
        let a = btn.find('a')
        a.css('background-color', 'deepskyblue')
        a.attr('href', a.attr('href') + '/file')
    })
}

function quickDownloadClick(e) {
    e.preventDefault()
    let button = $(e.currentTarget)
    let data = button.attr("arialabel")
    let modId = data.split("|")[0]
    let version = data.split('|')[1]
    let span = button.children()
    span.find("span").text("Fetching file list...");
    button.attr("data-tooltip", "");
    button.css('background-color', 'lightgrey')
    button.css('color', 'black')
    button.addClass('disabled')

    $.ajax("https://www.curseforge.com/minecraft/mc-mods/" + modId + "/files/all?filter-game-version=" + version).done(function (data) {
        let el = $("<div>").html(data);
        let tbody = el.find("tbody");

        let links = {
            "beta": null, "release": null, "alpha": null,
        }

        let fileNames = {
            "beta": null, "release": null, "alpha": null,
        }

        let latest = null;

        tbody.children("tr").each(function () {
            let row = $(this);
            let type = row.find("td:first-child").children().children().first().text()
            let fileName = row.find("td:nth-child(2)").children().first().text()
            let link = row.find("td:last-child").children().children().first().attr("href") + "/file"

            if (type === "R" && links.release == null) {
                links.release = link
                fileNames.release = fileName
            }
            if (type === "B" && links.beta == null) {
                links.beta = link
                fileNames.beta = fileName
            }
            if (type === "A" && links.alpha == null) {
                links.alpha = link
                fileNames.alpha = fileName
            }

            if (latest == null) latest = type
        })

        if (latest === "R") latest = "Release"
        if (latest === "B") latest = "Beta"
        if (latest === "A") latest = "Alpha"

        let createButton = (text, color) => {
            let link = links[text.toLowerCase()]
            let fileName = fileNames[text.toLowerCase()]

            let wrapper = button.parent().clone();
            wrapper.removeClass("___quick-download")
            let btn = wrapper.find("a")
            btn.removeClass("disabled")
            btn.attr("href", link)
            if (link) {
                btn.attr("data-tooltip", "Download the " + text + " version" + (latest === text ? " (latest)" : "") + ': "' + fileName + '"')
                btn.css("background-color", color)
                btn.css("color", "white")
                if (latest === text) {
                    btn.css("text-decoration", "underline")
                }
            } else {
                btn.attr("data-tooltip", "No " + text + " version available")
            }
            btn.attr("aria-label", "")
            btn.children().find("span").text(text)
            button.parent().parent().prepend(wrapper)
        }

        createButton("Alpha", "#D3CAE8")
        createButton("Beta", "#0e9bd8")
        createButton("Release", "#14b866")

        button.parent().remove()

        button.css("display", "none")
    });
}

function checkDependenciesClick(e) {
    e.preventDefault()
    let button = $(e.currentTarget)
    let modId = button.attr("arialabel")
    let span = button.children()
    span.find("span").text("Checking dependencies...");
    button.attr("data-tooltip", "")
    button.css('background-color', 'lightgrey')
    button.css('color', 'black')
    button.addClass('disabled')

    $.ajax("https://www.curseforge.com/minecraft/mc-mods/" + modId + "/relations/dependencies?filter-related-dependencies=3").done(function (data) {
        let el = $("<div>").html(data);
        let ul = el.find("ul.listing.listing-project");

        if (ul.find("li.no-results").length) {
            button.css("background-color", "green")
            span.find("span").text("✓ No dependencies")
            button.attr("data-tooltip", "Just download and play!")
            button.off("click")
            button.attr("href", "")
        } else {
            button.css("background-color", "orange")
            span.find("span").text("⚠ Dependencies found")
            button.attr("data-tooltip", "Click to see the dependencies")
            button.off("click")
            button.attr("href", "https://www.curseforge.com/minecraft/mc-mods/" + modId + "/relations/dependencies?filter-related-dependencies=3")
            button.attr("target", "_blank")
            button.attr("rel", "noopener noreferrer")
        }

        button.css('color', 'white')
        button.removeClass("disabled")
    })

}

function addModButtons() {
    // check if is on the minecraft mods page
    if (!document.location.href.match(/^https:\/\/www.curseforge.com\/minecraft\/mc-mods/g)) return

    let versionSelector = $("#filter-game-version");
    let version = versionSelector.val();
    let versionText = versionSelector.find("option:selected").text();
    let isVersionSelected = !!version;

    $(".project-listing-row .items-end.w-full .flex.mb-2.-mx-1").each(function (i) {
        // add quick download button
        let wrapper = $(this);
        let div = $('<div class="px-1 ___quick-download"></div>');
        let a = $('<a class="button" href="javascript:void(0)"></a>');
        if (isVersionSelected) {
            a.attr("data-tooltip", "Download the " + versionText.trim() + " version of this mod");
            a.css("background-color", "deepskyblue");
            a.on("click", quickDownloadClick)
        } else {
            a.attr("data-tooltip", "Select a version using the filter above");
            a.css("background-color", "grey");
            a.css("color", "white");
        }

        let text = $('<span class="button__text"></span>');
        let downloadSvg = wrapper.find("svg");
        let downloadUrl = downloadSvg.parent().parent().attr("href");
        let modId = /minecraft\/mc-mods\/(.+)\/download/.exec(downloadUrl)[1]
        a.attr("ariaLabel", modId + "|" + version);
        downloadSvg = downloadSvg.clone();
        downloadSvg.addClass("___download-svg");
        text.append(downloadSvg);
        let span = $('<span>Download</span>');
        text.append(span);
        a.append(text);
        div.append(a)
        wrapper.children().first().remove();
        wrapper.prepend(div);

        // add check dependencies button
        div = $('<div class="px-1 ___check-dependencies"></div>');
        a = $('<a class="button" href="javascript:void(0)"></a>');
        a.attr("data-tooltip", "Check for dependencies");
        a.css("background-color", "deepskyblue");
        a.on("click", checkDependenciesClick)
        text = $('<span class="button__text"></span>');
        a.attr("ariaLabel", modId);
        span = $('<span>Check for dependencies</span>');
        text.append(span);
        a.append(text);
        div.append(a)
        wrapper.prepend(div);
    })
}

(() => {
    fastRecentFilesDownload();
    addModButtons();
})()
