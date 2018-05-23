'use strict'

const toButton = document.querySelector('#_to')
const textarea = document.querySelector('#_chatText')

class App {
    constructor() {
    }

    /**
     *
     * @param {KeyboardEvent} event
     */
    keyup(event) {
        const key = event.key
        if (key === '@' && this.showMembers(this.textarea.value, key)) {
            if (hasMember) {
                toButton.click()
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
        return toButton.style.display !== 'none'
    }

    /**
     * @param {string} text value of textarea
     * @param {string} key
     */
    showMembers(text, key) {
        // if just first chara or space or breakline before '@'
        if (text === '@') {
            return true
        }
        return text.substr(-2, 2).match(/\s@/)
    }
}

const app = new App()

textarea.addEventListener('keyup', (e) => {
    app.keyup(e)
})
