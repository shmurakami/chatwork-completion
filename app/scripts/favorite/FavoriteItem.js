'use strict'

class FavoriteItems {
    constructor() {
        this.storageKey = `chatworkCompletionFavorite`

        const favorites = this.getFromStorage() || {items: []}
        this.favorites = favorites.items
    }

    getList() {
        return this.favorites.map(item => {
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
        const index = this.favorites
            .filter(f => f.messageId === messageId)
            .map((_, i) => {
                return i
            })
        delete this.favorites[index]
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

    toListItemElement() {
        const list = document.createElement('li')
        list.classList.add('chatworkCompletionFavoriteListItem')

        const profile = document.createElement('div')
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

        profile.appendChild(icon)
        profile.appendChild(name)
        profile.appendChild(date)

        room.appendChild(roomIcon)
        room.appendChild(roomName)

        list.appendChild(profile)
        list.appendChild(message)
        list.appendChild(room)
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
