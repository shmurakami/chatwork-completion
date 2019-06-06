'use strict'

import {elementReady} from './element_ready'
import {Listbox} from './listbox'
import {ExtensionApi} from "./extension_api";

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
        this.extensionApi = new ExtensionApi()

        this.clear()
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
        const img = document.createElement('img')
        img.setAttribute('src', room.icon)
        img.classList.add('chatworkCompletionSuggestRoomListIcon')

        const span = document.createElement('span')
        span.textContent = room.name

        const li = document.createElement('li')
        li.setAttribute('role', 'option')
        li.setAttribute('tabindex', -1)
        li.setAttribute('data-type', 'member')
        li.setAttribute('data-rid', room.id)
        if (index === 0) {
            li.classList.add('chatworkCompletionSuggestRoomListFocus')
        }
        li.classList.add('chatworkCompletionSuggestRoomList')

        if (room.hasUnread === true) {
            li.classList.add('chatworkCompletionSuggestRoomListHasUnread')
        }
        if (room.hasMention === true) {
            li.classList.add('chatworkCompletionSuggestRoomListHasMention')
        }

        li.appendChild(img)
        li.appendChild(span)

        li.addEventListener('click', (e) => {
            this.selectRoom(room.id)
        })

        return li
    }

    selectRoom(roomId) {
        location.hash = `#!rid${roomId}`;
        this.dismiss()
    }

    selectRoomList() {
        const focusedElement = roomListElement.querySelector('.chatworkCompletionSuggestRoomListFocus')
        if (!focusedElement) {
            return
        }
        const roomId = focusedElement.getAttribute('data-rid')
        this.selectRoom(roomId)
    }

    filterRoom(roomName) {
        const filteredRooms = [];
        const filtered = rooms.filter((r) => {
            return r.name.toLowerCase().indexOf(roomName.toLowerCase()) !== -1
        })

        const pusher = (room) => {
            filteredRooms.push(room)
        }
        // show only mention and unread in default
        let filters = [
            (room) => {return room.hasMention === true},
            (room) => {return room.hasMention === false && room.hasUnread === true},
        ]
        filters.forEach(f => {
            filtered.filter(f).forEach(pusher)
            if (filteredRooms.length >= 20) {
                return filteredRooms
            }
        })

        filtered
            .filter((room) => {
                return room.hasMention === false && room.hasUnread === false
            })
            .slice(0, 20)
            .forEach(pusher)

        return filteredRooms.slice(0, 20)
    }

    handleInput(event) {
        const code = event.code
        if (code === 'Escape') {
            this.dismiss(event)
            return
        }

        if (code === 'Enter') {
            this.selectRoomList()
        }

        if (code === 'ArrowUp' || code === 'ArrowDown') {
            // don't handle
            return
        }

        this.suggestRooms()
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

        new Listbox(backgroundElement, roomListElement)
    }

    async syncRooms() {
        rooms = []
        await this.extensionApi.getRooms(fetchedRooms => {
            fetchedRooms.forEach(room => {
                if (room.type.getValue() !== 'group') {
                    return
                }
                rooms.push({
                    id: room.getId(),
                    name: room.getName(),
                    icon: room.getIcon().getValue(),
                    hasMention: room.hasMention(),
                    hasUnread: room.matchUnread({
                        read: _ => false,
                        unread: _ => true,
                        overUnread: _ => true,
                    }),
                })
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

        backgroundElement.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                room.dismiss()
            }
        })

        roomInputElement.addEventListener('click', (e) => {
            // don't hide dialog if clicked input element
            e.stopPropagation()
        })

        roomInputElement.addEventListener('keyup', (e) => {
            room.handleInput(e)
        })

        document.addEventListener('keypress', (e) => {
            if (room.trigger(e)) {
                room.syncRooms()
                room.show()
            }
        })
    })

