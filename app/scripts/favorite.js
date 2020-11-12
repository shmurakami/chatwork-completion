import {elementReady} from "./element_ready";

import {FavoriteItems, FavoriteItem} from './favorite/FavoriteItem'
import {Message, Room, Account} from './message/message'

import starHeader from '../images/star_header.png'
import favStar from '../images/star.png'
import {mentionSidebarId} from "./mention_list/mention_list";

const rootWrapperSelector = 'currentselectedroom'
const roomHeaderSelector = '#_roomHeader .chatRoomHeader__titleContainer'
const headerParentSelector = '#_adminNavi'
const sidebarParentSelector = '#_mainContent'

export const favoriteSidebarId = 'extensionFavorite'

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
        buttonImage.classList = ['chatworkCompletionFavoriteHeaderButtonImage']
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
        const container = document.querySelector(`#${favoriteSidebarId}`)
        if (container.style.display === 'block') {
            container.style.display = 'none'
        } else {
            container.style.display = 'block'
            // hide mention view
            document.querySelector(`#${mentionSidebarId}`).style.display = 'none'
        }
    }

    addSidebar() {
        const parent = document.querySelector(sidebarParentSelector)
        const favoriteItems = this.createSidebarElement(this.favoriteItems.getList())
        parent.appendChild(favoriteItems)

        // set click handler to action buttons
        parent.querySelector(`#${favoriteSidebarId}`)
            .addEventListener('click', (event) => {
                const clickElement = parent.querySelector('button.chatworkCompletionFavoriteListItemActionButton:hover')
                if (clickElement) {
                    if (clickElement.getAttribute('data-role') === 'jump') {
                        this.jumpButtonListener(clickElement)
                    } else if (clickElement.getAttribute('data-role') === 'unStar') {
                        this.unStarButtonListener(clickElement)
                    }
                }
            })
    }

    /**
     * @param {FavoriteItems[]} items
     * @returns {HTMLElement}
     */
    createSidebarElement(items) {
        const aside = document.createElement('aside')
        aside.id = favoriteSidebarId
        aside.classList.add('chatworkCompletionFavorite')

        const header = document.createElement('header')
        header.classList.add('chatworkCompletionFavoriteHeader')
        header.textContent = '★ Favorites'

        const ul = document.createElement('ul')
        ul.classList.add('chatworkCompletionFavoriteList')

        let list
        for (let item of items) {
            list = item.toListItemElement()
            ul.appendChild(list)
        }

        aside.appendChild(header)
        aside.appendChild(ul)
        return aside
    }

    addFavButton() {
        const wrapper = document.querySelector(rootWrapperSelector)
        wrapper.addEventListener('mouseover', (event) => {
            // this is implemented forcibly and may has performance issue
            // it should be listened by _message class element but difficult to listen by this element directly
            const message = wrapper.querySelector('._message:hover')
            if (message) {
                // auto created message is not needed to save
                if (message.classList.contains('autoCreatedMessage')) {
                    return
                }
                this.messageHoverEventListener(message)
            }
        })

        wrapper.addEventListener('click', (event) => {
            if (!event.target) {
                return
            }
            const favTooltip = event.target.closest('li.chatworkCompletionTooltipFavorite')
            if (!favTooltip) {
                return
            }
            this.favorite(favTooltip)
        })
    }

    messageHoverEventListener(messageElement) {
        const actionNavigation = messageElement.querySelector('ul[role="toolbar"]')
        if (!actionNavigation) {
            return
        }

        const firstChild = actionNavigation.children[0]
        if (firstChild && firstChild.hasAttribute('extensionFavorite')) {
            return
        }

        const favMenu = document.createElement('li')
        favMenu.classList.add('linkStatus', 'actionNav__item', 'chatworkCompletionTooltipFavorite')
        favMenu.setAttribute('extensionFavorite', true)

        const favIcon = document.createElement('img')
        favIcon.setAttribute('src', favStar)
        favIcon.classList.add('chatworkCompletionTooltipFavoriteIcon')

        const favLabel = document.createElement('span')
        favLabel.classList.add('_showAreaText', 'showAreatext', 'actionNav__itemLabel')
        favLabel.textContent = 'Fav'
        favMenu.appendChild(favIcon)
        favMenu.appendChild(favLabel)

        actionNavigation.insertBefore(favMenu, actionNavigation.children[0])
    }

    favorite(favTooltipElement) {
        const messageElement = favTooltipElement.closest('div._message')
        if (!messageElement) {
            console.log('no message')
            return
        }

        const messageId = messageElement.getAttribute('data-mid')
        const message = messageElement.querySelector('pre').textContent
        const date = messageElement.querySelector('._timeStamp').textContent

        const roomId = messageElement.getAttribute('data-rid')

        const roomHeader = document.querySelector(roomHeaderSelector)
        const roomIcon = roomHeader.querySelector('#_subRoomIcon').getAttribute('src')
        const roomName = roomHeader.querySelector('._roomTitleText').textContent

        // probably no problem to get first img element...
        const speakerImage = messageElement.querySelector('img')
        // FIXME if message element does not have icon, it breaks. should get from profile data directly
        const speakerIcon = speakerImage.getAttribute('src')
        const speakerName = speakerImage.getAttribute('alt')

        const favoriteItem = new FavoriteItem(
            new Message(messageId, message, date),
            new Room(roomId, roomName, roomIcon),
            new Account(speakerName, speakerIcon),
            Date.now())
        this.favoriteItems.set(favoriteItem)

        const list = document.querySelector('ul.chatworkCompletionFavoriteList')
        list.insertBefore(favoriteItem.toListItemElement(), list.children[0])
    }

    jumpButtonListener(buttonElement) {
        // do nothing. call original jump event
    }

    unStarButtonListener(buttonElement) {
        const messageId = buttonElement.getAttribute('data-id')
        if (!messageId) {
            return
        }
        this.favoriteItems.remove(messageId)
        buttonElement.closest('li.chatworkCompletionFavoriteListItem').remove()
    }
}

elementReady(headerParentSelector)
    .then(() => {
        const favorite = new Favorite()
        favorite.addMenu()
        favorite.addSidebar()
        favorite.addFavButton()
    })
