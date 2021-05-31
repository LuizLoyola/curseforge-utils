function fastRecentFilesDownload() {
    $('div.cf-recentfiles-credits-wrapper').each(function(i) {
        let d = $(this);

        let btn = d//.clone();
        //btn.css('margin-left', '5px')
        let a = btn.find('a')
        a.css('background-color', 'deepskyblue')
        a.attr('href', a.attr('href') + '/file')

        //d.parent().append(btn);
    })
}

(() => {
    fastRecentFilesDownload();
})()
