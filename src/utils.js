/**
 * Prevents too frequent function execution
 * @param {function} func
 * @param {number} ms
 * @return {function}
 */
import {CLASSNAME_PREFIX} from './constants';

export const throttle = (func, ms) => {

    let isThrottled = false;
    let savedArgs;
    let savedThis;

    function wrapper() {
        if(isThrottled) { // (2)
            savedArgs = arguments;
            savedThis = this;
            return;
        }

        func.apply(this, arguments); // (1)

        isThrottled = true;

        setTimeout(function() {
            isThrottled = false; // (3)
            if(savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
};

export const domFind = (sel, el = document) => el.querySelector(sel);

export const domCreate = tag => document.createElement(tag);

export const domWrap = (el, tag) => {
    const wrapEl = 'string' === typeof tag ? domCreate(tag) : tag;
    el.parentElement.insertBefore(wrapEl, el);
    wrapEl.appendChild(el);
    return wrapEl;
};

export const domClone = el => el.cloneNode(true);

export const domPrepend = (parent, children) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/prepend
    // https://developer.mozilla.org/ru/docs/Web/API/Node/insertBefore
    parent.prepend(children);
    return parent;
};

/**
 * @param {string} n
 * @return {string}
 */
export const className = n => `${CLASSNAME_PREFIX}-${n.trim()}`;

/**
 * Makes css class name from array of strings
 * Adds prefix to each
 * @param {string[]} names
 * @return {string}
 */
export const classNames = names => names.filter(n => n.trim().length > 0).map(n => className(n)).join(' ');

/**
 * Toggles class names on elements depending on parameter
 * @param {HTMLElement|NodesList|Array} els
 * @param {Boolean} add
 * @param {String} classNames
 */
export const domToggleClassNames = (els, add, ...classNames) => {
    if(els.forEach) {
        els.forEach(el => domToggleClassNames(el, add, ...classNames));
    } else {
        const classList = els.classList;
        classNames.forEach(n => {
            n.split(' ').map(nn => {
                nn = nn.trim();
                if(nn.length) {
                    const exists = classList.contains(nn);
                    if(add && !exists) {
                        classList.add(nn);
                    } else if(!add && exists) {
                        classList.remove(nn);
                    }
                }
            });
        });
    }
};

/**
 * Adds class names to elements
 * @param {HTMLElement|NodesList|Array} els
 * @param {String} classNames
 */
export const domAddClassNames = (els, ...classNames) => domToggleClassNames(els, true, ...classNames);
/**
 * Adds event handler
 * @param {HTMLElement} el
 * @param {string} eventName
 * @param {function} handler
 * @param {Object} options
 */
export const domBind = (el, eventName, handler, options = {}) => el.addEventListener(eventName, handler, options);

/**
 * Removes event handler
 * @param {HTMLElement} el
 * @param {string} eventName
 * @param {function} handler
 */
export const domUnbind = (el, eventName, handler) => el.removeEventListener(eventName, handler);

export const calculateScrollbarWidth = () => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';

    // add innerdiv
    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
};