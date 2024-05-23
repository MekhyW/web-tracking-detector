let connectionsByTab = {};
let cookieDetailsByTab = {};
let localStorageByTab = {};

const servicePorts = {
  http: 80,
  https: 443
};

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.tabId !== -1 && details.originUrl && new URL(details.url).hostname !== new URL(details.originUrl).hostname) {
      if (!connectionsByTab[details.tabId]) {
        connectionsByTab[details.tabId] = {};
      }
      connectionsByTab[details.tabId][details.url] = (connectionsByTab[details.tabId][details.url] || 0) + 1;
    }
  },
  { urls: ["<all_urls>"] }
);

browser.webRequest.onHeadersReceived.addListener(
  function (details) {
    if (details.tabId !== -1) {
      const url = new URL(details.url);
      const isThirdParty = details.initiator && !details.initiator.endsWith(url.hostname);
      const cookieType = isThirdParty ? 'thirdParty' : 'firstParty';
      const cookieDetailType = isThirdParty ? 'thirdPartyDetails' : 'firstPartyDetails';

      if (!cookieDetailsByTab[details.tabId]) {
        cookieDetailsByTab[details.tabId] = {
          firstParty: 0,
          thirdParty: 0,
          firstPartyDetails: {},
          thirdPartyDetails: {}
        };
      }

      details.responseHeaders.forEach(header => {
        if (header.name.toLowerCase() === 'set-cookie') {
          let cookieName = header.value.split('=')[0].trim();
          cookieDetailsByTab[details.tabId][cookieType]++;
          if (cookieDetailsByTab[details.tabId][cookieDetailType][cookieName]) {
            cookieDetailsByTab[details.tabId][cookieDetailType][cookieName]++;
          } else {
            cookieDetailsByTab[details.tabId][cookieDetailType][cookieName] = 1;
          }
        }
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let tabId = sender.tab ? sender.tab.id : request.tabId;

  switch (request.action) {
    case "get_connections":
      let connections = connectionsByTab[tabId] ? connectionsByTab[tabId] : {};
      sendResponse({ connections: connections });
      break;
    case "get_cookies":
      let cookies = getCookiesDetails(tabId);
      sendResponse({ cookies: cookies });
      break;
    case "get_local_storage":
      getLocalStorage(tabId, sendResponse);
      return true; // Required to keep the message channel open for async response
    default:
      console.log("Unknown action:", request.action);
      break;
  }
  return true; 
});

// Cleanup on tab removal
browser.tabs.onRemoved.addListener(function (tabId) {
  delete connectionsByTab[tabId];
  delete cookieDetailsByTab[tabId];
  delete localStorageByTab[tabId];
});

// Reset data on tab update (e.g., when the URL changes)
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "loading") {
    connectionsByTab[tabId] = {};
    cookieDetailsByTab[tabId] = { firstParty: 0, thirdParty: 0, firstPartyDetails: {}, thirdPartyDetails: {} };
    localStorageByTab[tabId] = {};
  }
});

// Helper functions to get cookie details and local storage data
function getCookiesDetails(tabId) {
  let details = cookieDetailsByTab[tabId];
  if (details) {
    return {
      firstParty: details.firstParty,
      thirdParty: details.thirdParty,
      firstPartyDetails: details.firstPartyDetails,
      thirdPartyDetails: details.thirdPartyDetails
    };
  }
  return {
    firstParty: 0,
    thirdParty: 0,
    firstPartyDetails: {},
    thirdPartyDetails: {}
  };
}

function getLocalStorage(tabId, sendResponse) {
  browser.tabs.executeScript(tabId, {
    code: `
      JSON.stringify({
        localStorageCount: Object.keys(localStorage).length,
        sessionStorageCount: Object.keys(sessionStorage).length,
        localStorage: Object.entries(localStorage).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        sessionStorage: Object.entries(sessionStorage).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      });
    `
  }).then(results => {
    if (results && results[0]) {
      const data = JSON.parse(results[0]);
      localStorageByTab[tabId] = data;
      sendResponse({ data: data });
    } else {
      sendResponse({ error: "No data received" });
    }
  }).catch(error => {
    console.error(`Error executing script in tab ${tabId}:`, error);
    sendResponse({ error: error.message });
  });
}
