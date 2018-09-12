import {elementReady} from "../element_ready";

class Embed {
    embed() {
        const script = document.createElement('script')
        script.setAttribute('src', chrome.extension.getURL('dist/index.bundle.js'))
        document.querySelector('body').appendChild(script)
    }
}

elementReady('#root')
    .then((document) => {
        (new Embed()).embed()
    })
