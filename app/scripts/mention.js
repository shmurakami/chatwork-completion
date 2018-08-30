'use strict'

export class Mention {
    constructor() {
        this.toButton = document.querySelector('#_to')
    }

    keyPress(text) {
        if (!this.showMembers(text)) {
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