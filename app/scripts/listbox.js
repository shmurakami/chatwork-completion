/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
/**
 * @namespace aria
 */

const aria = {
    KeyCode: {
        RETURN: 13,
        ESC: 27,
        UP: 38,
        DOWN: 40,
    },
}

class Listbox {
    constructor(listboxNode) {
        this.listboxNode = listboxNode
        this.registerEvent()
    }

    registerEvent() {
        this.listboxNode.addEventListener('keydown', this.checkKeyPress.bind(this));
    }

    focusItem(element) {
        // set/remove aria-focus? attribute
        // add style for focus same as hover
        // need list by order
        // down/up/enter

        this.defocusItem(document.getElementById(this.activeDescendant));
        aria.Utils.addClass(element, 'focused');
        this.listboxNode.setAttribute('aria-activedescendant', element.id);
        this.activeDescendant = element.id;

        if (this.listboxNode.scrollHeight > this.listboxNode.clientHeight) {
            var scrollBottom = this.listboxNode.clientHeight + this.listboxNode.scrollTop;
            var elementBottom = element.offsetTop + element.offsetHeight;
            if (elementBottom > scrollBottom) {
                this.listboxNode.scrollTop = elementBottom - this.listboxNode.clientHeight;
            }
            else if (element.offsetTop < this.listboxNode.scrollTop) {
                this.listboxNode.scrollTop = element.offsetTop;
            }
        }
    }

    checkKeyPress(event) {
        // which?
        const key = event.which || event.keyCode
        let nextItem = document.querySelector('');
        if (!nextItem) {
            return;
        }

        switch (key) {
            case aria.KeyCode.UP:
            case aria.KeyCode.DOWN:
                event.preventDefault();

                if (key === aria.KeyCode.UP) {
                    nextItem = nextItem.previousElementSibling;
                }
                else {
                    nextItem = nextItem.nextElementSibling;
                }

                if (nextItem) {
                    this.focusItem(nextItem);
                }

                break;
            case aria.KeyCode.RETURN:
                event.preventDefault();

                let nextUnselected = nextItem.nextElementSibling;
                while (nextUnselected) {
                    if (nextUnselected.getAttribute('aria-selected') !== 'true') {
                        break;
                    }
                    nextUnselected = nextUnselected.nextElementSibling;
                }
                if (!nextUnselected) {
                    nextUnselected = nextItem.previousElementSibling;
                    while (nextUnselected) {
                        if (nextUnselected.getAttribute('aria-selected') !== 'true') {
                            break;
                        }
                        nextUnselected = nextUnselected.previousElementSibling;
                    }
                }

                if (nextUnselected) {
                    this.focusItem(nextUnselected);
                }
                break;
        }
    }

}

export {Listbox}
