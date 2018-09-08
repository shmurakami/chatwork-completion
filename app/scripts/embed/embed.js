import {elementReady} from "../element_ready";

export class Embed {
    embed() {
        const script = document.createElement('script')
        script.setAttribute('src', chrome.extension.getURL('scripts/embed/extension.js'))
        document.querySelector('body').appendChild(script)
    }
}

elementReady('#root')
    .then((document) => {
        (new Embed()).embed()
    })
