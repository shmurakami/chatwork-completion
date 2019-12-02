import {elementReady} from "./element_ready";

import starHeader from '../images/star_header.png'

const headerParentSelector = '#_adminNavi'
const sidebarParentSelector = '#_'

class Favorite {
    constructor() {
        this.favoriteItems = new FavoriteItems()
    }

    addMenu() {
        const parent = document.querySelector(headerParentSelector)
        const button = this.createButtonElement()

        button.addEventListener('click', () => {
            this.clickListener()
        })

        parent.appendChild(button)
    }

    createButtonElement() {
        const buttonImage = document.createElement('img')
        // buttonImage.src = '/images/star.png';
        buttonImage.src = starHeader
        buttonImage.classList = ['globalHeaderPlatform__icon']
        // // Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">

        const buttonContent = document.createElement('span')
        buttonContent.classList.add('globalHeaderNavItem__button', 'chatworkCompletionFavoriteHeaderButton')

        const list = document.createElement('li')
        list.setAttribute('role', 'button')
        list.setAttribute('aria-label', 'Favorite')
        list.id = 'extension_openFavorite'
        list.classList.add('globalHeaderNavItem', '_showDescription', 'chatworkCompletionFavorite')

        buttonContent.appendChild(buttonImage)
        list.appendChild(buttonContent)

        return list
    }

    clickListener() {
        console.log(this.favoriteItems.getList())
    }

    addSidebar() {

    }

    createSidebarElement() {

    }
}

class FavoriteItems {
    constructor() {
        this.storageKey = `chatworkCompletionFavorite`

        const favorites = this.getFromStorage() || {items: []}
        this.favorites = favorites.items
    }

    getList() {
        return this.favorites
    }

    set(id, message) {
        this.favorites[id] = message
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

elementReady(headerParentSelector)
    .then(() => {
        const favorite = new Favorite()
        favorite.addMenu()
        favorite.addSidebar()
    })
