'use strict'

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
});

chrome.runtime.onMessage.addEventListener(function (message, callback) {
    if (message === 'runContentScript') {
        chrome.tabs.executeScript({
            file: './embed/extension.js'
        })
    }
})

