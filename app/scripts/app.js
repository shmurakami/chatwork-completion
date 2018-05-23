'use strict'

const textareaSelector = '#_chatText'

class App {
    constructor() {
        this.toButton = document.querySelector('#_to')
    }

    /**
     *
     * @param {string} text
     * @param {KeyboardEvent} event
     */
    keypress(text, event) {
        const key = event.key
        if (key === '@' && this.showMembers(text, key)) {
            if (this.hasMember()) {
                this.toButton.click()
                // ignore '@'
                // @ key is just flag to show menmber list
                event.preventDefault()
            }
        }
    }

    /**
     * @return {boolean}
     */
    hasMember() {
        return this.toButton.style.display !== 'none'
    }

    /**
     * @param {string} text value of textarea
     * @param {string} key
     */
    showMembers(text, key) {
        // if just first chara or space or breakline before '@'
        if (text === '') {
            return true
        }
        return text.substr(-1, 1).match(/\s/)
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

