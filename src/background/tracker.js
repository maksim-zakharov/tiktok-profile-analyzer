chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled....');

// Standard Google Universal Analytics code
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here

    ga('create', 'UA-186370775-1', 'auto');
    ga('set', 'checkProtocolTask', function(){});
    ga('require', 'displayfeatures');
    ga('send', 'pageview', '/options.html');

    // ymInit();
});

// here we receive the coming message from the content script page
chrome.runtime.onMessage.addListener(function( request, sender, sendResponse ) {
    console.log('onMessage....');
    ga('send', 'event', request.action, JSON.stringify(request.data));
});

function ymInit() {
    <!-- Yandex.Metrika counter -->
    var ymScript = document.createElement('script');
    ymScript.type = "text/javascript";
    ymScript.innerHTML = `
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(70946401, "init", {
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true,
    webvisor:true
});`;
    var ymnoScript = document.createElement('noscript');
    ymnoScript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/70946401" style="position:absolute; left:-9999px;" alt="" /></div>`;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ymScript, s);
    s.parentNode.insertBefore(ymnoScript, s);
    <!-- /Yandex.Metrika counter -->
}
