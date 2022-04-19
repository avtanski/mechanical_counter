/*
 * Split Flap Display
 *
 * 2022 (C) Alexander Avtanski <alex@avtanski.com>
 * This work is licensed under a Creative Commons Attribution 4.0 International License
 */

"use strict";

const U = {
    a: function(parent, tag, attr, text) {
        let e = document.createElement(tag)
        if (parent) parent.appendChild(e);
        if (attr) for (let a in attr) e.setAttribute(a, attr[a]);
        if (text) e.appendChild(document.createTextNode(text));
        return e;
    },

    c: function(element) {
        while (element && element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}

const SplitFlapDisplay = function(parent, columns, rows, audioFilesPath, size) {

}
