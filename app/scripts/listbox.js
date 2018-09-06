/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
/**
 * @namespace aria
 */

const keyCode = {
    // RETURN: 'Enter', // can't handle enter event from listbox now
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
}

class Listbox {
    constructor(containerNode, listBoxNode) {
        // index for focused row
        this.position = 0

        this.containerNode = containerNode
        this.listBoxNode = listBoxNode
        this.registerEvent()
    }

    registerEvent() {
        this.containerNode.addEventListener('keydown', this.checkKeyPress.bind(this));
    }

    focusItem(element) {
        const focusClassName = 'chatworkCompletionSuggestRoomListFocus'
        const focusedElement = this.listBoxNode.querySelector(`.${focusClassName}`)
        if (focusedElement) {
            focusedElement.classList.remove(focusClassName)
        }
        element.classList.add(focusClassName)

        if (this.listBoxNode.scrollHeight > this.listBoxNode.clientHeight) {
            const scrollBottom = this.listBoxNode.clientHeight + this.listBoxNode.scrollTop
            const elementBottom = element.offsetTop + element.offsetHeight

            if (elementBottom > scrollBottom) {
                this.listBoxNode.scrollTop = elementBottom - this.listBoxNode.clientHeight

            } else if (element.offsetTop < this.listBoxNode.scrollTop) {
                this.listBoxNode.scrollTop = element.offsetTop
            }
        }
    }

    checkKeyPress(event) {
        const key = event.code

        let currentItem = this.listBoxNode.children[this.position]
        if (!currentItem) {
            this.position = 0
            currentItem = this.listBoxNode.children[this.position]
            if (!currentItem) {
                return
            }
        }

        if (key === keyCode.UP || key === keyCode.DOWN) {
            event.preventDefault();

            if (key === keyCode.UP) {
                if (this.position === 0) {
                    return
                }
                this.position -= 1

            } else {
                if (this.listBoxNode.children.length <= this.position + 1) {
                    return
                }
                this.position += 1
            }
            const element = this.listBoxNode.children[this.position]
            if (element) {
                this.focusItem(element)
            }
        }
    }

}

export {Listbox}
