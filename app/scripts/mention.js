'use strict'

import {elementReady} from './element_ready'

const wrapperAreaSelector = '#root'

const messageAreaSelector = '#_chatSendArea'
const textareaSelector = '.chatInput__textarea'

export class Mention {
    constructor() {
        this.toButton = document.querySelector('#_to')
    }

    handler(text, event) {
        if (event.key !== '@' || !this.showMembers(text)) {
            return
        }

        if (this.hasMember()) {
            this.toButton.click()
            // ignore '@'
            // @ key is just flag to show menmber list
            event.preventDefault()
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
     */
    showMembers(text) {
        // if just first chara or space or breakline before '@'
        if (text === '') {
            return true
        }
        return text.substr(-1, 1).match(/\s/)
    }

}

const setupMention = textareaSelector => {
    elementReady(textareaSelector)
        .then(textarea => {
            const mention = new Mention()

            textarea.addEventListener('keypress', (e) => {
                mention.handler(textarea.value, e)
            })
        })
}


window.onhashchange = function () {
    setupMention(textareaSelector)
}

// elementReady(wrapperAreaSelector)
//     .then(chatContent => {
//         setupMention(messageAreaSelector)
//     })
