'use strict'

import {elementReady} from './element_ready'

const rootSelector = '#root'

const contentSelector = '#_content'

const backgroundActiveClass = 'chatworkCompletionDialogBackground__active'

const backgroundId = 'chatworkCompletionDialogBackground'
const backgroundSelector = `#${backgroundId }`
let backgroundElement

const roomInputId = 'chatworkCompletionRoomInput'
const roomInputSelector = `#${roomInputId}`
let roomInputElement

const roomListId = 'chatworkCompletionRoomList'
const roomListSelector = `#${roomListId}`
let roomListElement

let rooms = [
    {id: 1, name: 'a', hasMention: false, hasUnread: false,},
    {id: 2, name: 'ka', hasMention: true, hasUnread: true,},
    {id: 3, name: 'sa', hasMention: false, hasUnread: true,},
    {id: 4, name: 'ta', hasMention: true, hasUnread: true,},
    {id: 5, name: 'akasatana', hasMention: false, hasUnread: false,},
]

// flag of popup room dialog is added. should be made exactly once
let rendered = false

export class Room {
    constructor() {
        this.clear()
    }

    createSuggestListElements(rooms) {
        const liLists = []
        for (let room of rooms) {
            let li = document.createElement('li')
            li.classList = ['chatworkCompletionSuggestRoomList']
            li.textContent = room.name
            if (room.hasMention) {
                li.classList.add('chatworkCompletionSuggestRoomListHasMention')
            }
            if (room.hasUnread === true) {
                li.classList.add('chatworkCompletionSuggestRoomListHasUnread')
            }
            liLists.push(li)
        }
        return liLists
    }

    filterRoom(roomName) {
        let filteredRooms = [];
        const filtered = rooms.filter((r) => {
            return r.name.indexOf(roomName) !== -1
        })

        const pusher = (room) => {
            filteredRooms.push(room)
        }

        filtered.filter(room => {
            return room.hasMention === true
        }).forEach(pusher)

        filtered.filter(room => {
            return room.hasMention === false
                && room.hasUnread === true
        }).forEach(pusher)

        filtered.filter(room => {
            return room.hasMention === false
                && room.hasUnread === false
        }).forEach(pusher)

        return filteredRooms
    }

    handler() {
        // observe this element
        const text = roomInputElement.value
        if (text === '') {
            return
        }

        const filteredRooms = this.filterRoom(text)
        this.renderSuggestRooms(filteredRooms)
    }

    trigger(e) {
        return e.key === 'i' && e.metaKey === true
    }

    renderSuggestRooms(rooms) {
        this.createSuggestListElements(rooms).forEach((element) => {
            roomListElement.appendChild(element)
        })
    }

    async addDialog() {
        if (rendered === true) {
            return
        }
        await this.makeDialog()
        rendered = true
    }

    makeDialog() {
        const background = document.createElement('div')
        background.setAttribute('id', backgroundId)
        background.classList = ['chatworkCompletionDialogBackground'];
        // background.style.cssText = 'width: 100%; height: 100%; position: fixed; top:0; left: 0; background-color: rgba(0,0,0,0.4); z-index: 1000;'
        const dialog = document.createElement('div')
        dialog.classList = ['chatworkCompletionDialog']

        const roomInput = document.createElement('input')
        roomInput.setAttribute('id', roomInputId)
        roomInput.setAttribute('type', 'text')
        roomInput.setAttribute('placeholder', 'room name...')
        roomInput.setAttribute('autocomplete', 'off')
        roomInput.classList = ['chatworkCompletionDialogRoomInput']

        const roomList = document.createElement('ul')
        roomList.setAttribute('id', roomListId)
        roomList.classList = ['chatworkCompletionSuggestRoomListSet']

        dialog.appendChild(roomInput)
        dialog.appendChild(roomList)

        background.appendChild(dialog)
        document.querySelector(rootSelector).appendChild(background)
    }

    show() {
        if (backgroundElement.classList.contains(backgroundActiveClass)) {
            return
        }
        backgroundElement.classList.add(backgroundActiveClass)
        roomInputElement.focus()
    }

    hide() {
        backgroundElement.classList.remove(backgroundActiveClass)
        this.clear()
    }

    syncRooms() {
        rooms = [
            {id: 1, name: 'a', hasMention: false, hasUnread: false,},
            {id: 2, name: 'ka', hasMention: true, hasUnread: true,},
            {id: 3, name: 'sa', hasMention: false, hasUnread: true,},
            {id: 4, name: 'ta', hasMention: true, hasUnread: true,},
            {id: 5, name: 'akasatana', hasMention: false, hasUnread: false,},
        ]
    }

    clear() {
        this.filteredRooms = []

        if (rendered === true) {
            roomInputElement.value = ''
            while (roomListElement.firstChild) {
                roomListElement.firstChild.remove()
            }
        }
    }

}

elementReady(contentSelector)
    .then(() => {
        const root = document.querySelector(rootSelector)
        const room = new Room
        room.addDialog()

        backgroundElement = document.querySelector(backgroundSelector)
        roomInputElement = document.querySelector(roomInputSelector)
        roomListElement = document.querySelector(roomListSelector)

        backgroundElement.addEventListener('click', () => {
            room.hide()
        })

        roomInputElement.addEventListener('click', (e) => {
            // don't hide dialog if clicked input element
            e.stopPropagation()
        })

        roomInputElement.addEventListener('keyup', (e) => {
            room.handler()
        })

        root.addEventListener('keypress', (e) => {
            if (room.trigger(e)) {
                room.show()
            }
        })
    })

