/*
flow
とりあえずstyle作らないと話にならん が

ユーザ一覧表示のmodeを管理

_chatTextに @ が入力されたら
flag on
shiftだけ判定される場合があって微妙

どのタイミングでflagオフする？

@から区切り文字までを取得して
それを使って
incremental search
↑↓で選べるようにする
ユーザを選んだらchatworkのスタイルに変換する

 */

'use strict'

// const text = require('./text')
// console.log(text)

class Text {
    constructor(inputTag) {
        /**
         * show mention member list
         * @type {boolean}
         */
        this.showMentionMemberList = false;

        /**
         * @type {HTMLTextAreaElement}
         */
        this.textarea = inputTag
    }

    /**
     *
     * @param {KeyboardEvent} event
     */
    keyup(event) {
        this.showMentionMemberList = this.isMentioning(this.textarea.value, event.key)
    }

    /**
     *
     * @param {string} text value of textarea
     * @param {string} key
     */
    isMentioning(text, key) {
        if (this.showMentionMemberList === false && key === '@') {
            console.log('start')
            return true
        }

        if (text === '') {
            console.log('empty')
            return false
        }

        if (key === 'Escape') {
            console.log('escape')
            return false
        }
    }

    getUsers() {
        return [
            {id: '123', cid: 'cw-aoi', name: 'aoi'},
            {id: '234', cid: 'cw_aomi', name: 'aomi'},
            {id: '345', cid: 'cw-ito', name: 'ito'},
        ]
    }
}

const textarea = document.querySelector('#_chatText')
const text = new Text(textarea)

textarea.addEventListener('keyup', (e) => {
    text.keyup(e)
})
