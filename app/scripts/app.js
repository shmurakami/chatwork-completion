'use strict'

import {Mention} from './mention'

const textareaSelector = '#_chatText'

class App {
    constructor() {
        this.mentionApp = new Mention()
    }

    /**
     * @param {string} text
     * @param {KeyboardEvent} event
     */
    keypress(text, event) {
        const key = event.key

        if (key === '@') {
            this.mentionApp.keyPress(text)
        }
    }
}

// make it to different file if this proj supports import/export build system i.e. webpack or browserify
// from https://gist.github.com/jwilson8767/db379026efcbd932f64382db4b02853e

/**
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions.
 *
 * @param selector
 * @returns {Promise}
 */
function elementReady(selector) {
  return new Promise((resolve, reject) => {
    let el = document.querySelector(selector);
    if (el) {resolve(el);}
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        //Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    })
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      });
  });
}

elementReady(textareaSelector)
    .then((textarea) => {
        const app = new App()
        textarea.addEventListener('keypress', (e) => {
            app.keypress(textarea.value, e)
        })
    })

