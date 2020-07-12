'use strict'

export class Message {
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

export class MessageDate {
    constructor(date) {
        this.date = date
    }

    format() {
        const date = this.date
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
}

export class Room {
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

export class Account {
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

