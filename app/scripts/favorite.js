import {elementReady} from "./element_ready";

import starHeader from '../images/star_header.png'

const headerParentSelector = '#_adminNavi'
const sidebarParentSelector = '#_content'

const sidebarId = 'extensionFavorite'

class Favorite {
    constructor() {
        this.favoriteItems = new FavoriteItems()
    }

    addMenu() {
        const parent = document.querySelector(headerParentSelector)
        const button = this.createButtonElement()

        button.addEventListener('click', () => {
            this.headerClickListener()
        })

        parent.appendChild(button)
    }

    createButtonElement() {
        const buttonImage = document.createElement('img')
        // buttonImage.src = '/images/star.png';
        buttonImage.src = starHeader
        buttonImage.classList = ['globalHeaderPlatform__icon']
        // Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">

        const buttonContent = document.createElement('span')
        buttonContent.classList.add('globalHeaderNavItem__button', 'chatworkCompletionFavoriteHeaderButton')

        const list = document.createElement('li')
        list.setAttribute('role', 'button')
        list.setAttribute('aria-label', 'Favorite')
        list.id = 'extension_openFavorite'
        list.classList.add('globalHeaderNavItem', '_showDescription', 'chatworkCompletionFavoriteHeaderButton')

        buttonContent.appendChild(buttonImage)
        list.appendChild(buttonContent)

        return list
    }

    headerClickListener() {
        const container = document.querySelector(`#${sidebarId}`)
        if (container.style.display === 'block') {
            container.style.display = 'none'
        } else {
            container.style.display = 'block'
        }
    }

    addSidebar() {
        const parent = document.querySelector(sidebarParentSelector)
        const sidebar = this.createSidebarElement(this.favoriteItems.getList())
        parent.appendChild(sidebar)
    }

    createSidebarElement(items) {
        const aside = document.createElement('aside')
        aside.id = sidebarId
        aside.classList.add('chatworkCompletionFavorite')

        const ul = document.createElement('ul')
        ul.classList.add('chatworkCompletionFavoriteList')

        let list
        for (let item of items) {
            list = item.toListItemElement()
            ul.appendChild(list)
        }

        aside.appendChild(ul)
        return aside
    }
}

class FavoriteItems {
    constructor() {
        this.storageKey = `chatworkCompletionFavorite`

        const favorites = this.getFromStorage() || {items: []}
        this.favorites = favorites.items
    }

    getList() {
        // TODO sort by date desc
        return this.favorites
    }

    /**
     *
     * @param {FavoriteItem} favoriteItem
     */
    set(favoriteItem) {
        // TODO check item count
        this.favorites[favoriteItem.getId()] = favoriteItem.toObject()
        this.setToStorage(this.favorites)
    }

    remove(id) {
        delete this.favorites[id]
        this.setToStorage(this.favorites)
    }

    setToStorage(favorites) {
        localStorage.setItem(this.storageKey, JSON.stringify({items: favorites}))
    }

    getFromStorage() {
        return localStorage.getItem(this.storageKey)
    }
}

class FavoriteItem {
    constructor(id, message, roomIcon, roomName, date, icon) {
        this.id = id;
        this.message = message;
        this.roomIcon = roomIcon;
        this.roomName = roomName;
        this.date = date;
        this.icon = icon;
    }

    getId() {
        return this.id
    }

    toObject() {
        return {
            id: this.id,
            message: this.message,
            roomName: this.roomName,
            date: this.date,
            icon: this.icon,
        }
    }

    toListItemElement() {
        const list = document.createElement('li')
        list.classList.add('chatworkCompletionFavoriteListItem')

        const profile = document.createElement('div')
        profile.classList.add('chatworkCompletionFavoriteListItemProfile')

        const icon = document.createElement('img')
        icon.setAttribute('src', this.icon)
        icon.classList.add('chatworkCompletionFavoriteListItemAccountIcon')

        const name = document.createElement('span')
        name.classList.add('chatworkCompletionFavoriteListItemProfileName')

        const date = document.createElement('span')
        date.classList.add('chatworkCompletionFavoriteListItemDate')

        const message = document.createElement('p')
        message.classList.add('chatworkCompletionFavoriteListItemMessage')

        const room = document.createElement('p')
        room.classList.add('chatworkCompletionFavoriteListItemRoom')

        const roomIcon = document.createElement('img')
        roomIcon.setAttribute('src', this.roomIcon)
        roomIcon.classList.add('chatworkCompletionFavoriteListItemRoomIcon')

        const roomName = document.createElement('small')
        roomName.classList.add('chatworkCompletionFavoriteListItemRoomName')

        profile.appendChild(icon)
        profile.appendChild(name)
        profile.appendChild(date)

        room.appendChild(roomIcon)
        room.appendChild(roomName)

        list.appendChild(profile)
        list.appendChild(room)
        return list
//   li
//    div
//     img
//     span
//     span
//    /div
//    p
//    p
//     img
//     small
//    /p
    }
}

elementReady(headerParentSelector)
    .then(() => {
        const favorite = new Favorite()
        favorite.addMenu()
        favorite.addSidebar()
    })
