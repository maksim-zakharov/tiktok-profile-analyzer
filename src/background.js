// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete' &&
//         tab.url.includes('http')) {
//         chrome.tabs.executeScript(tabId, { file:
//                 './inject_script.js' }, function () {
//             chrome.tabs.executeScript(tabId, { file:
//                     './foreground.bundle.js' }, function () {
//                 console.log('INJECTED AND EXECUTED');
//             });
//         });
//     }
// });

// // Standard Google Universal Analytics code
// (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//     (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//     m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
// })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here
//
// ga('create', 'UA-186370775-1', 'auto'); // Enter your GA identifier
// ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
// ga('require', 'displayfeatures');
// ga('send', 'pageview', '/mypage.html'); // Specify the virtual path



var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-186370775-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
