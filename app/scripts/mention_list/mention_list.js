'use strict'

/**
 * whats to do...
 * make popup, input chatwork auth token, call auth
 *
 * init
 *
 * get mention list
 *
 * render
 *
 */

import {baseUrl} from './base_url'
import {elementReady} from "../element_ready";
import {MentionMessages} from "./mention_message";

const headerParentSelector = '#_adminNavi'
const sidebarParentSelector = '#_mainContent'

const sidebarId = 'extensionMentionList'

export class MentionList {
    constructor() {
        this.isRegistered = false

        const messages = []
        this.mentionMessages = new MentionMessages(messages)
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
        const buttonImage = document.createElement('span')
        buttonImage.textContent = '@'
        buttonImage.classList = ['globalHeaderPlatform__icon']

        const buttonContent = document.createElement('span')
        buttonContent.classList.add('globalHeaderNavItem__button', 'chatworkCompletionMentionListHeaderButton')

        const list = document.createElement('li')
        list.setAttribute('role', 'button')
        list.setAttribute('aria-label', 'Favorite')
        list.id = 'extension_openMentionList'
        list.classList.add('globalHeaderNavItem', '_showDescription')

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
        const mentionListAsideElement = this.createSidebarHeaderElement()

        if (this.isRegistered) {
            const mentionListElement = this.createSidebarElement(mentionListAsideElement, this.mentionMessages)
            parent.appendChild(mentionListElement)

            // set click handler to action buttons
            parent.querySelector(`#${sidebarId}`)
                .addEventListener('click', (event) => {
                    const clickElement = parent.querySelector('button.chatworkCompletionMentionListItemActionButton:hover')
                    if (clickElement) {
                        if (clickElement.getAttribute('data-role') === 'jump') {
                            this.jumpButtonListener(clickElement)
                        }
                    }
                })
        } else {
            const notRegisteredViewElement = this.createNotRegisteredView(mentionListAsideElement)
            parent.appendChild(notRegisteredViewElement)
        }
    }

    jumpButtonListener(buttonElement) {
        // do nothing. call original jump event
    }

    createSidebarHeaderElement() {
        const aside = document.createElement('aside')
        aside.id = sidebarId
        aside.classList.add('chatworkCompletionMentionList')

        const header = document.createElement('header')
        header.classList.add('chatworkCompletionMentionListHeader')
        header.textContent = '@ Mention List'

        aside.appendChild(header)
        return aside
    }

    createSidebarElement(parentElement, mentionMessages) {
        const ul = document.createElement('ul')
        ul.classList.add('chatworkCompletionMentionList')

        let list
        for (let item of mentionMessages.items()) {
            list = item.toListItemElement()
            ul.appendChild(list)
        }

        parentElement.appendChild(ul)
        return parentElement
    }

    // view in sidebar for not yet registered
    createNotRegisteredView(parentElement) {
        const section = document.createElement('section')

        const h1 = document.createElement('h1')
        h1.textContent = 'You have not registered API Token.'
        h1.classList.add('chatworkCompletionMentionListNotRegisteredHeading')

        const button = document.createElement('button')
        button.textContent = 'Register'
        button.classList.add('chatworkCompletionMentionListNotRegisteredButton')

        section.appendChild(h1)
        section.appendChild(button)

        parentElement.appendChild(section)
        return parentElement
    }

}

elementReady(headerParentSelector)
    .then(() => {
        const mentionList = new MentionList()
        mentionList.addMenu()
        mentionList.addSidebar()
    })
