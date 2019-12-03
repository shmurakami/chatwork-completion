'use strict'

import star from '../../images/star.png'

class FavoriteItems {
    constructor() {
        this.storageKey = `chatworkCompletionFavorite`

        const favorites = this.getFromStorage() || {items: []}
        this.favorites = favorites.items
    }

    getList() {
        return this.favorites
            .sort((e1, e2) => {
                return e1.compare(e2)
            })
            .map(item => {
                return FavoriteItem.restore(item)
            })
    }

    /**
     * @param {FavoriteItem} favoriteItem
     */
    set(favoriteItem) {
        // TODO check item count, duplicated item
        this.favorites.push(favoriteItem.toObject())
        this.setToStorage(this.favorites)
    }

    remove(messageId) {
        this.favorites = this.favorites.filter(item => item.messageId !== messageId)
        console.log(`un star message: ${messageId}`)
        this.setToStorage(this.favorites)
    }

    setToStorage(favorites) {
        console.log(JSON.stringify({items: favorites}))
        localStorage.setItem(this.storageKey, JSON.stringify({items: favorites}))
    }

    getFromStorage() {
        return JSON.parse(localStorage.getItem(this.storageKey))
    }
}

class FavoriteItem {
    /**
     *
     * @param {Message} message
     * @param {Room} room
     * @param {Speaker} speaker
     */
    constructor(message, room, speaker) {
        this.messageModel = message
        this.roomModel = room
        this.speakerModel = speaker

        this.messageId = message.id
        this.message = message.message
        this.messageDate = message.date
        this.roomId = room.id
        this.roomName = room.name
        this.roomIcon = room.icon
        this.speakerName = speaker.name
        this.speakerIcon = speaker.icon
    }

    static restore(object) {
        return new this(
            new Message(object.messageId, object.message, object.date),
            new Room(object.roomId, object.roomName, object.roomIcon),
            new Speaker(object.speakerName, object.speakerIcon)
        )
    }

    toObject() {
        const message = this.messageModel.toObject()
        const room = this.roomModel.toObject()
        const speaker = this.speakerModel.toObject()

        return {
            messageId: message.id,
            message: message.message,
            date: message.date,
            roomId: room.id,
            roomIcon: room.icon,
            roomName: room.name,
            speakerIcon: speaker.icon,
            speakerName: speaker.name,
        }
    }

    /**
     * sort by desc order
     * @param {FavoriteItem} item
     */
    compare(item) {
        if (this.messageDate > item.messageDate) {
            return -1
        }
        if (this.messageDate < item.messageDate) {
            return 1
        }
        return 0
    }

    toListItemElement() {
        const list = document.createElement('li')
        list.classList.add('chatworkCompletionFavoriteListItem')

        const profile = document.createElement('p')
        profile.classList.add('chatworkCompletionFavoriteListItemProfile')

        const icon = document.createElement('img')
        icon.setAttribute('src', this.speakerIcon)
        icon.setAttribute('alt', '')
        icon.classList.add('chatworkCompletionFavoriteListItemAccountIcon')

        const name = document.createElement('span')
        name.classList.add('chatworkCompletionFavoriteListItemProfileName')
        name.textContent = this.speakerName

        const date = document.createElement('span')
        date.classList.add('chatworkCompletionFavoriteListItemDate')
        date.textContent = this.messageDate

        const message = document.createElement('p')
        message.classList.add('chatworkCompletionFavoriteListItemMessage')
        message.textContent = this.message

        const room = document.createElement('p')
        room.classList.add('chatworkCompletionFavoriteListItemRoom')

        const roomIcon = document.createElement('img')
        roomIcon.setAttribute('src', this.roomIcon)
        roomIcon.setAttribute('alt', '')
        roomIcon.classList.add('chatworkCompletionFavoriteListItemRoomIcon')

        const roomName = document.createElement('small')
        roomName.classList.add('chatworkCompletionFavoriteListItemRoomName')
        roomName.textContent = this.roomName

        // action items
        const actionBar = document.createElement('p')
        actionBar.classList.add('chatworkCompletionFavoriteListItemActionBar')

        const jumpButton = document.createElement('button')
        jumpButton.textContent = '#←'
        jumpButton.classList.add('chatworkCompletionFavoriteListItemActionButton', '_messageLink') // _messageLink is trigger to open dialog
        jumpButton.setAttribute('data-role', 'jump')
        jumpButton.setAttribute('data-rid', this.roomId)
        jumpButton.setAttribute('data-mid', this.messageId)

        const unStarImage = document.createElement('img')
        unStarImage.setAttribute('src', star)
        unStarImage.setAttribute('alt', '')

        const unStarButton = document.createElement('button')
        unStarButton.appendChild(unStarImage)
        unStarButton.classList.add('chatworkCompletionFavoriteListItemActionButton')
        unStarButton.setAttribute('data-id', this.messageId)
        unStarButton.setAttribute('data-role', 'unStar')
        actionBar.append(jumpButton, unStarButton)

        profile.append(icon, name, date)

        room.append(roomIcon, roomName)

        list.append(profile, message, room, actionBar)
        return list
    }
}

class Message {
    constructor(id, message, date) {
        this.id = id;
        this.message = message;
        this.date = date;
    }

    toObject() {
        return {
            id: this.id,
            message: this.message,
            date: this.date
        }
    }
}

class Room {
    constructor(id, name, icon) {
        this.id = id;
        this.name = name;
        this.icon = icon;
    }

    toObject() {
        return {
            id: this.id,
            name: this.name,
            icon: this.icon,
        }
    }
}

class Speaker {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
    }

    toObject() {
        return {
            name: this.name,
            icon: this.icon,
        }
    }
}

export {FavoriteItems, FavoriteItem, Message, Room, Speaker}
