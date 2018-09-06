'use strict'

import {elementReady} from './element_ready'
import {Listbox} from './listbox'

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

let rooms = []

// flag of popup room dialog is added. should be made exactly once
let rendered = false

export class Room {
    constructor() {
        this.clear()
        this.syncRooms()
    }

    createRoomListElements(rooms) {
        const lists = []
        let index = 0;
        for (let room of rooms) {
            lists.push(this.createListItemElement(room, index))
            index++
        }
        return lists
    }

    createListItemElement(room, index) {
        const li = document.createElement('li')
        li.setAttribute('role', 'option')
        li.setAttribute('tabindex', -1)
        li.setAttribute('data-type', 'member')
        li.setAttribute('data-index', index)
        li.classList = ['chatworkCompletionSuggestRoomList']
        li.textContent = room.name
        if (room.hasUnread === true) {
            li.classList.add('chatworkCompletionSuggestRoomListHasUnread')
        }
        if (room.hasMention === true) {
            li.classList.add('chatworkCompletionSuggestRoomListHasMention')
        }

        li.addEventListener('click', (e) => {
            this.selectRoom(room)
        })

        return li
    }

    selectRoom(room) {
        const selector = `li.roomListItem[data-rid="${room.id}"]`
        const li = document.querySelector(selector)
        if (li) {
            li.click()
        }
    }

    filterRoom(roomName) {
        const filteredRooms = [];
        const filtered = rooms.filter((r) => {
            return r.name.toLowerCase().indexOf(roomName.toLowerCase()) !== -1
        })

        const pusher = (room) => {
            filteredRooms.push(room)
        }
        let filters = [
            (room) => {return room.hasMention === true},
            (room) => {return room.hasMention === false && room.hasUnread === true},
            (room) => {return room.hasMention === false && room.hasUnread === false}
        ]

        filters.forEach(f => {
            filtered.filter(f).forEach(pusher)
            if (filteredRooms.length >= 20) {
                return filteredRooms
            }
        })

        return filteredRooms
    }

    suggestRooms() {
        const text = roomInputElement.value
        const filteredRooms = this.filterRoom(text)
        this.renderSuggestRooms(filteredRooms)
    }

    trigger(e) {
        return e.key === 'i' && e.metaKey === true
    }

    renderSuggestRooms(rooms) {
        this.clearSuggestRooms(roomListElement)
        this.createRoomListElements(rooms).forEach((element) => {
            roomListElement.appendChild(element)
        })
        new Listbox(document.querySelector(roomListSelector))
    }

    async addDialog() {
        if (rendered === true) {
            return
        }
        await this.makeDialog()
        rendered = true
    }

    makeDialog() {
        // TODO rewrite by template tag
        const background = document.createElement('div')
        background.setAttribute('id', backgroundId)
        background.classList = ['chatworkCompletionDialogBackground'];

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
        roomList.setAttribute('role', 'listbox')
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

    syncRooms() {
        rooms = []
        document.querySelectorAll('.roomListItem').forEach(li => {
            let hasMention = !!(li.querySelector('li.roomListBadges__unreadBadge--hasMemtion'))
            rooms.push({
                id: li.getAttribute('data-rid'),
                name: li.querySelector('.roomListItem__roomName').textContent,
                hasMention: hasMention,
                hasUnread: hasMention || !!(li.querySelector('li._unreadBadge')),
            })
        })
    }

    clear() {
        if (rendered === true) {
            roomInputElement.value = ''
            this.clearSuggestRooms(roomListElement)
        }
    }

    clearSuggestRooms(listElement) {
        while (listElement.firstChild) {
            listElement.firstChild.remove()
        }
    }

    dismiss() {
        backgroundElement.classList.remove(backgroundActiveClass)
        this.clear()
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
            room.dismiss()
        })

        roomInputElement.addEventListener('click', (e) => {
            // don't hide dialog if clicked input element
            e.stopPropagation()
        })

        roomInputElement.addEventListener('keydown', (e) => {
            // ESC
            if (e.keyCode === 27) {
                room.dismiss(e)
            }
        })

        roomInputElement.addEventListener('keyup', (e) => {
            room.suggestRooms()
        })

        root.addEventListener('keypress', (e) => {
            if (room.trigger(e)) {
                room.syncRooms()
                room.show()
            }
        })
    })

