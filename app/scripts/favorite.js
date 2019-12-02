import {elementReady} from "./element_ready";

import starHeader from '../images/star_header.png'

const parentSelector = '#_adminNavi'

class Favorite {
    constructor() {
    }

    addMenu() {
        const parent = document.querySelector(parentSelector)
        const button = this.createButtonElement()
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
        list.id = 'extension_openFavorite'
        list.classList.add('globalHeaderNavItem', '_showDescription', 'chatworkCompletionFavorite')

        buttonContent.appendChild(buttonImage)
        list.appendChild(buttonContent)

        return list
    }
}

elementReady(parentSelector)
    .then(() => {
        const favorite = new Favorite()
        favorite.addMenu()
    })
