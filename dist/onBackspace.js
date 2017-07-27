'use strict';

var getCurrentBlockquote = require('./getCurrentBlockquote');
var unwrapBlockquote = require('./transforms/unwrapBlockquote');

/**
 * User pressed Delete in an editor:
 * Unwrap the blockquote if at the start of the inner block.
 */
function onBackspace(event, data, state, opts) {
    var startOffset = state.startOffset,
        isCollapsed = state.isCollapsed,
        document = state.document,
        startBlock = state.startBlock;


    if (!getCurrentBlockquote(opts, state) || !isCollapsed) {
        return null;
    }

    // Block is empty, we exit the blockquote
    if (startOffset === 0 && !document.getPreviousSibling(startBlock.key)) {
        event.preventDefault();

        return unwrapBlockquote(opts, state.transform()).apply();
    }
}

module.exports = onBackspace;