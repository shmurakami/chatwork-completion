"use strict";
const matches = chrome.runtime.getManifest().content_scripts.shift().matches;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    let url = tab.url || '';
    if (!url) return;

    for (let item of matches) {
        item = item.replace(/\*/g, '.*');
        item = item.replace(/\//g, '\\/');
        let pattern = new RegExp(item);

        if (url.match(pattern)) {
            chrome.pageAction.show(tabId);
            break;
        }
    }
});

