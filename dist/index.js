'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var onEnter = require('./onEnter');
var onTab = require('./onTab');
var onBackspace = require('./onBackspace');
var makeSchema = require('./makeSchema');

var getCurrentBlockquote = require('./getCurrentBlockquote');
var wrapInBlockquote = require('./transforms/wrapInBlockquote');
var unwrapBlockquote = require('./transforms/unwrapBlockquote');

var KEY_ENTER = 'enter';
var KEY_TAB = 'tab';
var KEY_BACKSPACE = 'backspace';

/**
 * A Slate plugin to handle keyboard events in lists.
 * @param {Object} [opts] Options for the plugin
 * @param {String} [opts.type='blockquote'] The type of unordered lists
 * @param {String} [opts.typeOL='ol_list'] The type of ordered lists
 * @param {String} [opts.typeItem='list_item'] The type of list items
 * @param {String} [opts.typeDefault='paragraph'] The type of default block in items
 * @return {Object}
 */

function EditBlockquote(opts) {
    opts = opts || {};
    opts.type = opts.type || 'blockquote';
    opts.typeDefault = opts.typeDefault || 'paragraph';

    /**
     * Is the selection in a blockquote
     */
    function isSelectionInBlockquote(state) {
        return Boolean(getCurrentBlockquote(opts, state));
    }

    /**
     * Bind a transform to be only applied in list
     */
    function bindTransform(fn) {
        return function (transform) {
            var state = transform.state;


            if (!isSelectionInBlockquote(state)) {
                return transform;
            }

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return fn.apply(undefined, _toConsumableArray([opts, transform].concat(args)));
        };
    }

    /**
     * User is pressing a key in the editor
     */
    function onKeyDown(e, data, state) {
        // Build arguments list
        var args = [e, data, state, opts];

        switch (data.key) {
            case KEY_ENTER:
                return onEnter.apply(undefined, args);
            case KEY_TAB:
                return onTab.apply(undefined, args);
            case KEY_BACKSPACE:
                return onBackspace.apply(undefined, args);
        }
    }

    var schema = makeSchema(opts);

    return {
        onKeyDown: onKeyDown,
        schema: schema,

        utils: {
            isSelectionInBlockquote: isSelectionInBlockquote
        },

        transforms: {
            wrapInBlockquote: wrapInBlockquote.bind(null, opts),
            unwrapBlockquote: bindTransform(unwrapBlockquote)
        }
    };
}

module.exports = EditBlockquote;