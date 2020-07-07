'use strict'

import {Message, Room, Account} from "../message/message";
import star from "../../images/star.png";

export class MentionMessages {
    constructor() {
        this.mentionMessages = []
    }

    items() {
        return this.mentionMessages
    }

}

export class MentionMessage {

    toListItemElement() {
        const list = document.createElement('li')
        list.classList.add('chatworkCompletionMentionListItem')

        const profile = document.createElement('p')
        profile.classList.add('chatworkCompletionMentionListItemProfile')

        const icon = document.createElement('img')
        icon.setAttribute('src', this.speakerIcon)
        icon.setAttribute('alt', '')
        icon.classList.add('chatworkCompletionMentionListItemAccountIcon')

        const name = document.createElement('span')
        name.classList.add('chatworkCompletionMentionListItemProfileName')
        name.textContent = this.speakerName

        const date = document.createElement('span')
        date.classList.add('chatworkCompletionMentionListItemDate')
        date.textContent = this.messageDate

        const message = document.createElement('p')
        message.classList.add('chatworkCompletionMentionListItemMessage')
        message.textContent = this.message

        const room = document.createElement('p')
        room.classList.add('chatworkCompletionMentionListItemRoom')

        const roomIcon = document.createElement('img')
        roomIcon.setAttribute('src', this.roomIcon)
        roomIcon.setAttribute('alt', '')
        roomIcon.classList.add('chatworkCompletionMentionListItemRoomIcon')

        const roomName = document.createElement('small')
        roomName.classList.add('chatworkCompletionMentionListItemRoomName')
        roomName.textContent = this.roomName

        // action items
        const actionBar = document.createElement('p')
        actionBar.classList.add('chatworkCompletionMentionListItemActionBar')

        const jumpButton = document.createElement('button')
        jumpButton.textContent = '#←'
        jumpButton.classList.add('chatworkCompletionMentionListItemActionButton', '_messageLink') // _messageLink is trigger to open dialog
        jumpButton.setAttribute('data-role', 'jump')
        jumpButton.setAttribute('data-rid', this.roomId)
        jumpButton.setAttribute('data-mid', this.messageId)

        const unStarImage = document.createElement('img')
        unStarImage.setAttribute('src', star)
        unStarImage.setAttribute('alt', '')

        profile.append(icon, name, date)

        room.append(roomIcon, roomName)

        list.append(profile, message, room, actionBar)
        return list
    }


}

