import {elementReady} from "./element_ready";

const parentSelector = '#_adminNavi'

class Favorite {
    constructor() {
    }

    addMenu() {
        const parent = document.querySelector(parentSelector)
        const button = this.createButtonElement()

    }

    createButtonElement() {
        const buttonImage = document.createElement('svg')
        buttonImage.s
        const buttonContent = document.createElement('span')
        const list = document.createElement('li')
    }
}

elementReady(parentSelector)
    .then(() => {
        const favorite = new Favorite()
        favorite.addMenu()
    })
