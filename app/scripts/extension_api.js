'use strict'

export class ExtensionApi {
    constructor() {
        this.lifeCycleEvent = window.lifeCycleEvent
    }

    getRooms(callback) {
        this.lifeCycleEvent.emit("getRooms", (rooms) => {
            callback(rooms)
        })
    }


}