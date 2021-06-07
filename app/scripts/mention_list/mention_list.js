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

import {elementReady} from "../element_ready";
import {MentionMessage} from "./mention_message";

const headerParentSelector = '#_adminNavi'
const sidebarParentSelector = '#_mainContent'

import reload from '../../images/refresh.svg'
import settings from '../../images/settings.svg'
import {Account, Message, MessageDate, Room} from "../message/message";
import {AuthenticationClient} from "../client/AuthenticationClient";
import {MentionSubscribeClient} from "../client/MentionSubscribeClient";
import {MentionListClient} from "../client/MentionListClient";

const storageKey = 'chatworkCompletionMentionList'

export const mentionSidebarId = 'extensionMentionList'

export class MentionList {
    constructor() {
        this.isRegistered = !!localStorage.getItem(storageKey);
        this.mentionListClient = new MentionListClient();
        this.mentionSubscribeClient = new MentionSubscribeClient();
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
        list.setAttribute('aria-label', 'Mention List')
        list.id = 'extension_openMentionList'
        list.classList.add('globalHeaderNavItem', '_showDescription')

        buttonContent.appendChild(buttonImage)
        list.appendChild(buttonContent)

        return list
    }

    headerClickListener() {
        const container = document.querySelector(`#${mentionSidebarId}`)
        if (container.style.display === 'block') {
            container.style.display = 'none'
            this.unsubscribe();
        } else {
            container.style.display = 'block'
            // subscribe only while this menu opens
            const credential = this.retrieveCredential()
            if (credential) {
              this.subscribe(credential.account_id);
            }
        }
    }

    addSidebar() {
        const parent = document.querySelector(sidebarParentSelector)
        const mentionListAsideElement = this.createSidebarHeaderElement()

        const mentionListElement = this.createSidebarElement(mentionListAsideElement)

        const settingViewElement = this.createSettingView(mentionListAsideElement)

        parent.appendChild(mentionListElement)
        parent.appendChild(settingViewElement)

        // in default mention list is active, setting is inactive
        if (!this.isRegistered) {
            this.togglePane()
        }
    }

    createSidebarHeaderElement() {
        const aside = document.createElement('aside')
        aside.id = mentionSidebarId
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

        if (this.isRegistered) {
            this.refreshMentionList()
        }
        return parentElement
    }

    // view in sidebar for not yet registered
    createSettingView(parentElement) {
        const section = document.createElement('section')
        section.classList.add('chatworkCompletionMentionListSettingView')

        const h1 = document.createElement('h1')
        h1.textContent = 'You have to set your Access Token generated by mention server.'
        h1.classList.add('chatworkCompletionMentionListNotRegisteredHeading')

        const accountIdInput = document.createElement('input')
        accountIdInput.type = 'text'
        accountIdInput.classList.add('chatworkCompletionMentionListSettingAccessTokenField')
        accountIdInput.placeholder = 'Account ID'

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
            this.saveAccessToken(accountIdInput.value, input.value)
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
        section.appendChild(accountIdInput)
        section.appendChild(input)
        section.appendChild(buttonRow)

        parentElement.appendChild(section)
        return parentElement
    }

    saveAccessToken(accountId, token) {
      new AuthenticationClient().authentication(accountId, token)
        .then(async response => {
            const reply = response.toObject();
            const authToken = reply.token
            localStorage.setItem(storageKey, JSON.stringify({
              'account_id': accountId,
              'token': authToken,
            }))
            console.log('saved access token to storage')

            // start subscribe
            this.subscribe(accountId);
          })
        .catch(error => console.error(error))
    }

    deleteAccessToken() {
        localStorage.removeItem(storageKey)
        document.querySelector('.chatworkCompletionMentionListSettingAccessTokenField').value = ''
        console.log('deleted access token from storage')

        // stop subscription
        this.mentionSubscribeClient.unsubscribe();
    }

    refreshMentionList() {
        const credential = this.retrieveCredential()

        this.mentionListClient.fetch(credential)
            .then(async response => {
                const mentionListReply = response.toObject();
                this.refreshListElement(mentionListReply)
          })
          .catch(error => {
              console.error(error)
              // localStorage.removeItem(accessTokenStorageKey)
          })
    }

  refreshListElement(mentionListReply) {
    // refresh dom node
    const oldUl = document.querySelector('.chatworkCompletionMentionListItemList')
    const section = document.querySelector('.chatworkCompletionMentionListMentionView')
    section.removeChild(oldUl)
    const ul = document.createElement('ul')
    ul.classList.add('chatworkCompletionMentionListItemList')
    section.appendChild(ul)

    mentionListReply.listList.map(
      mentionReplyValues => this.appendMentionElementToList(ul, mentionReplyValues)
    )
  }

  mentionReplyValuesToListItemElement(mentionReplyValues) {
    const date = new MessageDate(new Date(mentionReplyValues.sendTime * 1000));
    const mention = new MentionMessage(
      new Message(mentionReplyValues.id, mentionReplyValues.body, date.format()),
      new Room(mentionReplyValues.roomId, mentionReplyValues.roomName, mentionReplyValues.roomIconUrl),
      new Account(mentionReplyValues.fromAccountName, mentionReplyValues.fromAccountAvatarUrl));
    return mention.toListItemElement();
  }

  appendMentionElementToList(ul, mentionReplyValues) {
    ul.appendChild(this.mentionReplyValuesToListItemElement(mentionReplyValues))
  }

  prependMentionElementToList(ul, mentionReplyValues) {
    ul.insertBefore(this.mentionReplyValuesToListItemElement(mentionReplyValues), ul.childNodes[0] || null)
  }

  togglePane() {
    document.querySelector('.chatworkCompletionMentionListMentionView').classList.toggle('active')
    document.querySelector('.chatworkCompletionMentionListSettingView').classList.toggle('active')
    }

    subscribe(accountId) {
      const credential = this.retrieveCredential()

      const ul = document.querySelector('.chatworkCompletionMentionListItemList')
      if (!ul) {
        return;
      }

      this.mentionSubscribeClient.subscribe(credential, {
        onNext: (mentionReply) => {
          this.prependMentionElementToList(ul, mentionReply.toObject());
        },
        onError: (e) => {
          console.log('onError', e);
        },
        onUnsubscribe: () => {
          // need to subscribe again to keep subscribing
          // wrap with setTimeout to stop while machine asleep
          window.setTimeout(() => {
            this.subscribe(accountId);
          }, 100)
        },
      });
    }

    unsubscribe() {
      this.mentionSubscribeClient.unsubscribe();
    }

    retrieveCredential() {
      return JSON.parse(localStorage.getItem(storageKey)) || null;
    }
}

elementReady(headerParentSelector)
    .then(() => {
        const mentionList = new MentionList()
        mentionList.addMenu()
        mentionList.addSidebar()
    })
