'use strict';
import {
    calculateScrollbarWidth, className, domAddClassNames, domBind, domClone, domCreate, domFind, domPrepend,
    domWrap, throttle
} from './utils';

require("./sass/_table-scroll.scss");

let _scrollbarWidth = 0;
let _dpr = window.devicePixelRatio;

const getScrollbarWidth = () => {
    if(!_scrollbarWidth) {
        _scrollbarWidth = calculateScrollbarWidth();
    }
    return _scrollbarWidth;
};

class TableScroll {
    constructor(tableElement) {
        this._el = {
            table: tableElement
            , container: null
        };

        this._handleResize = throttle(this._handleResize.bind(this), 50);
        this._setTheadPadding = this._setTheadPadding.bind(this);

        this._render();
    }

    getElement(key) {
        return key in this._el ? this._el[key] : null;
    }

    destroy() {

    }

    /**
     * Creates required html elements, adds classes
     * @private
     */
    _render() {
        const table = this.getElement('table');
        const initialClassName = table.className;
        domAddClassNames(table, className('table'), className('tbody'));

        const fh = domCreate('div');

        domAddClassNames(fh, className('container'));
        domWrap(table, fh);

        const tbodyWrapper = domWrap(table, 'div');
        domAddClassNames(tbodyWrapper, className('tbody-wrapper'));

        const colGroup = domFind('colgroup', table);
        const colGroupClone = domClone(colGroup);
        const thead = domFind('thead', table);
        const thTable = domCreate('table');

        domAddClassNames(thTable, initialClassName, className('table'), className('thead'));

        domPrepend(fh, thTable);
        thTable.appendChild(colGroupClone);
        thTable.appendChild(thead);

        const theadWrapper = domWrap(thTable, 'div');
        domAddClassNames(theadWrapper, className('thead-wrapper'));

        this._el.container = fh;
        this._el.tbodyWrapper = tbodyWrapper;
        this._el.theadWrapper = theadWrapper;

        domBind(window, 'resize', this._handleResize);

        setTimeout(this._setTheadPadding, 20);
    }

    _handleResize() {
        if (window.devicePixelRatio !== _dpr) {
            _dpr = window.devicePixelRatio;
            _scrollbarWidth = 0;
        }
        this._setTheadPadding();
    }

    _setTheadPadding() {
        const table = this.getElement('table');
        const tbodyWrapper = this.getElement('tbodyWrapper');
        const theadWrapper = this.getElement('theadWrapper');
        const wrapperHeight = tbodyWrapper.getBoundingClientRect().height;
        const contentHeight = table.getBoundingClientRect().height;
        let value = 0;

        if (contentHeight > wrapperHeight) {
            value = `${getScrollbarWidth()}px`;
        }

        theadWrapper.style.paddingRight = value;
    };
}

export const create = (tableElement, options = {}) => new TableScroll(tableElement, options);