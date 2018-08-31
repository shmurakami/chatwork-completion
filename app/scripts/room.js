'use strict'

import {elementReady} from './element_ready'

const rootSelector = '#root'

const roomInputId = 'chatworkCompletionRoomInput'
const roomInputSelector = `#${roomInputId}`
let roomInputElement

let rooms = [
    {id: 1, name: 'a', hasMention: false, hasUnread: false,},
    {id: 2, name: 'ka', hasMention: true, hasUnread: false,},
    {id: 3, name: 'sa', hasMention: false, hasUnread: true,},
    {id: 4, name: 'ta', hasMention: true, hasUnread: true,},
    {id: 5, name: 'akasatana', hasMention: false, hasUnread: false,},
]

// flag of popup room dialog is added. should be made exactly once
let dialogAdded = false

export class Room {
    constructor() {
        this.filterValue = ''
    }

    filterRoom(roomName) {
        let filteredRooms = [];
        const filtered = rooms.filter((r) => {
            return r.name.indexOf(roomName) !== -1
        })
        // sort
        // mention is most prior
        // unread is next
        // rest
        
    }

    handler() {
        // observe this element
        const text = roomInputElement.value
        console.log(text)

        const filteredRooms = this.filterRoom(text)
        this.renderSuggestRooms(filteredRooms)
    }

    trigger(e) {
        return e.key === 'i' && e.metaKey === true
    }

    filterRoom(value) {
        return []
    }

    renderSuggestRooms(rooms) {
        console.log(rooms)
    }

    async addDialog() {
        if (dialogAdded) {
            return
        }
        await this.makeDialog()
        dialogAdded = true
    }

    makeDialog() {
        const background = document.createElement('div')
        background.style.cssText = 'width: 100%; height: 100%; position: fixed; top:0; left: 0; background-color: rgba(0,0,0,0.4); z-index: 1000;'
        const dialog = document.createElement('div')
        dialog.style.cssText = 'width: 500px; height:400px; position: absolute; top:150px;right:0;bottom:0;left:0; margin: auto;'

        const roomInput = document.createElement('input')
        roomInput.setAttribute('id', roomInputId)
        roomInput.setAttribute('type', 'text')
        roomInput.style.cssText = 'width:100%; height:40px; font-size:28px; line-height:1em; background-color:#ffffff; border:1px solid #ffffff; border-radius:10px;'

        dialog.appendChild(roomInput)
        background.appendChild(dialog)
        document.querySelector(rootSelector).appendChild(background)
    }

}

elementReady(rootSelector)
    .then((root) => {
        const room = new Room
        room.addDialog()

        roomInputElement = document.querySelector(roomInputSelector)

        roomInputElement.addEventListener('keyup', (e) => {
            room.filterRoom(e.target.value)
        })

        root.addEventListener('keypress', (e) => {
            if (room.trigger(e)) {
                room.handler()
            }
        })
    })

