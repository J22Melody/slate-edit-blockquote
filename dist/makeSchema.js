'use strict';

/**
 * Create a schema for blockquotes
 * @param {String} opts.type The type of blockquote
 * @param {String} opts.typeDefault The type of the default block in blockquotes
 * @return {Object} A schema definition with rules to normalize blockquotes
 */
function makeSchema(opts) {
    return {
        rules: [containBlocks(opts)]
    };
}

/**
 *  @param {String} opts.type The type of blockquote
 *  @param {String} opts.typeDefault The type of the default block in blockquotes
 *  @return {Object} A rule that ensure blockquotes always contain
 *  blocks.
 */
function containBlocks(opts) {
    return {
        match: function match(node) {
            return node.type == opts.type;
        },
        validate: function validate(item) {
            // Wrap text nodes in default block
            var toWrap = item.nodes.filter(function (node) {
                return node.kind !== 'block';
            });

            return toWrap.isEmpty() ? null : { toWrap: toWrap };
        },


        /**
         * Wraps the given nodes in a default block
         * @param {List<Nodes>} value.toWrap
         */
        normalize: function normalize(transform, node, value) {
            return value.toWrap.reduce(function (tr, n) {
                return tr.wrapBlockByKey(n.key, opts.typeDefault);
            }, transform);
        }
    };
}

module.exports = makeSchema;