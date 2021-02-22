'use strict'

import star from '../../images/star.png'
import {Message, Room, Account} from "../message/message";

class FavoriteItems {
    constructor() {
        this.storageKey = `chatworkCompletionFavorite`

        const favorites = this.getFromStorage() || {items: []}
        this.favorites = favorites.items
    }

    getList() {
        return this.favorites
            .map(item => {
                return FavoriteItem.restore(item)
            })
            .sort((e1, e2) => {
                return e1.compare(e2)
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
     * @param {Account} speaker
     * @param {number} currentTime
     */
    constructor(message, room, speaker, currentTime) {
        this.currentTime = currentTime;
        this.messageModel = message
        this.roomModel = room
        this.speakerModel = speaker

        this.messageId = message.id
        this.message = message.message.substring(0, 1024)
        this.messageDate = message.date
        this.roomId = room.id
        this.roomName = room.name
        this.roomIcon = room.icon
        this.speakerName = speaker.name
        this.speakerIcon = speaker.icon

        this.addedTime = currentTime
    }

    static restore(object) {
        return new this(
            new Message(object.messageId, object.message, object.date),
            new Room(object.roomId, object.roomName, object.roomIcon),
            new Account(object.speakerName, object.speakerIcon),
            object.addedTime
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
            addedTime: this.addedTime,
        }
    }

    /**
     * sort by desc order
     * @param {FavoriteItem} item
     */
    compare(item) {
        if (this.addedTime > item.addedTime) {
            return -1
        }
        if (this.addedTime < item.addedTime) {
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

export {FavoriteItems, FavoriteItem}
