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
import {MentionMessage} from "./mention_message";

const headerParentSelector = '#_adminNavi'
const sidebarParentSelector = '#_mainContent'

import reload from '../../images/refresh.svg'
import settings from '../../images/settings.svg'
import {Account, Message, Room} from "../message/message";

const sidebarId = 'extensionMentionList'

const accessTokenStorageKey = 'chatworkCompletionMentionListAccessToken'

export class MentionList {
    constructor() {
        this.isRegistered = !!localStorage.getItem(accessTokenStorageKey)
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

        const mentionListElement = this.createSidebarElement(mentionListAsideElement)

        const settingViewElement = this.createSettingView(mentionListAsideElement)

        parent.appendChild(mentionListElement)
        parent.appendChild(settingViewElement)

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

        // in default mention list is active, setting is inactive
        if (!this.isRegistered) {
            this.togglePane()
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

        const reloadButton = document.createElement('img')
        reloadButton.src = reload
        reloadButton.classList.add('chatworkCompletionMentionListHeaderActionButton')
        reloadButton.addEventListener('click', _ => {
            console.log('update mention list')
            this.refreshMentionList()
        })

        const settingsButton = document.createElement('img')
        settingsButton.src = settings
        settingsButton.classList.add('chatworkCompletionMentionListHeaderActionButton')
        settingsButton.addEventListener('click', _ => this.togglePane())

        const actions = document.createElement('div')
        actions.classList.add('chatworkCompletionMentionListHeaderActionContainer')
        actions.appendChild(reloadButton)
        actions.appendChild(settingsButton)

        header.appendChild(actions)

        aside.appendChild(header)
        return aside
    }

    createSidebarElement(parentElement) {
        const section = document.createElement('section')
        section.classList.add('chatworkCompletionMentionListMentionView', 'active')

        const ul = document.createElement('ul')
        ul.classList.add('chatworkCompletionMentionListItemList')

        section.appendChild(ul)
        parentElement.appendChild(section)

        this.refreshMentionList()
        return parentElement
    }

    // view in sidebar for not yet registered
    createSettingView(parentElement) {
        const section = document.createElement('section')
        section.classList.add('chatworkCompletionMentionListSettingView')

        const h1 = document.createElement('h1')
        h1.textContent = 'You have to set your Access Token generated by mention server.'
        h1.classList.add('chatworkCompletionMentionListNotRegisteredHeading')

        const input = document.createElement('input')
        if (this.isRegistered) {
            input.value = '************'
        }
        input.type = 'text'
        input.classList.add('chatworkCompletionMentionListSettingAccessTokenField')

        const saveButton = document.createElement('button')
        saveButton.textContent = 'Save'
        saveButton.classList.add('chatworkCompletionMentionListSettingAccessTokenSave')
        saveButton.addEventListener('click', _ => {
            this.saveAccessToken(input.value)
            // TODO access to server and switch to mention list view
        })

        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.classList.add('chatworkCompletionMentionListSettingAccessTokenDelete')
        deleteButton.addEventListener('click', _ => {
            this.deleteAccessToken()
        })

        const buttonRow = document.createElement('div')
        buttonRow.classList.add('chatworkCompletionMentionListSettingAccessTokenButtonContainer')

        buttonRow.appendChild(saveButton)
        buttonRow.appendChild(deleteButton)

        section.appendChild(h1)
        section.appendChild(input)
        section.appendChild(buttonRow)

        parentElement.appendChild(section)
        return parentElement
    }

    saveAccessToken(token) {
        localStorage.setItem(accessTokenStorageKey, token)
        console.log('saved access token to storage')
    }

    deleteAccessToken() {
        localStorage.removeItem(accessTokenStorageKey)
        document.querySelector('.chatworkCompletionMentionListSettingAccessTokenField').value = ''
        console.log('deleted access token from storage')
    }

    refreshMentionList() {
        fetch(`${baseUrl}/test.php`, {
            headers: {
                'Content-Type': `application/json`,
                'X-Token': localStorage.getItem(accessTokenStorageKey)
            }
        })
            .then(response => {
                response.json()
                    .then(contents => {
                        // refresh dom node
                        const oldUl = document.querySelector('.chatworkCompletionMentionListItemList')
                        const section = document.querySelector('.chatworkCompletionMentionListMentionView')
                        section.removeChild(oldUl)
                        const ul = document.createElement('ul')
                        ul.classList.add('chatworkCompletionMentionListItemList')
                        section.appendChild(ul)

                        contents.list.map(item => {
                            const mention = new MentionMessage(
                                new Message(item.id, item.body, item.sendTime),
                                new Room(item.roomId, item.roomName, item.roomIconUrl),
                                new Account(item.fromAccountId, item.fromAccountName, item.fromAccountAvatarUrl))
                            ul.appendChild(mention.toListItemElement())
                        })
                    })
                    .catch(error => console.error(error))
            })
            .catch(error => {
                console.error(error)
                // localStorage.removeItem(accessTokenStorageKey)
            })

    }

    togglePane() {
        document.querySelector('.chatworkCompletionMentionListMentionView').classList.toggle('active')
        document.querySelector('.chatworkCompletionMentionListSettingView').classList.toggle('active')
    }

}

elementReady(headerParentSelector)
    .then(() => {
        const mentionList = new MentionList()
        mentionList.addMenu()
        mentionList.addSidebar()
    })
