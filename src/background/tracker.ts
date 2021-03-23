import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { ga } from "react-ga";

const getExtensionInfo = () => new Promise<any>((resolve) => {
  chrome.management.get(chrome.runtime.id, (extensionInfo) => {
    resolve(extensionInfo)
  });
})

const bootstrap = async () => {
  const extensionInfo = await getExtensionInfo()
  const environment = extensionInfo.installType !== 'development' ? 'production' : 'development';
  initGA();
  await SentryConfigure(environment, extensionInfo.version)

// here we receive the coming message from the content script page
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('onMessage....');
    ga('send', 'event', request.action, JSON.stringify(request.data));
  });
}

bootstrap();

const initGA = () => {
  chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled....');

// Standard Google Universal Analytics code
    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
        // @ts-ignore
      }, i[r].l = 1 * new Date();
      // @ts-ignore
      a = s.createElement(o),
        // @ts-ignore
        m = s.getElementsByTagName(o)[0];
      // @ts-ignore
      a.async = 1;
      // @ts-ignore
      a.src = g;
      // @ts-ignore
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); // Note: https protocol here

    ga('create', 'UA-186370775-1', 'auto');
    ga('set', 'checkProtocolTask', function () {
    });
    ga('require', 'displayfeatures');
    ga('send', 'pageview', '/options.html');

    // ymInit();
  });
}

const SentryConfigure = async (environment: string, version) => {
  let release = "";
  if (environment !== 'development') {
    release += "background-v" + version;
  } else {
    release += "background"
  }

  Sentry.init({
    dsn: "https://9d72dc24da7c47c7aa4fb2a33843b58f@o555463.ingest.sentry.io/5689768",
    release,
    environment,
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}
