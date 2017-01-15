'use strict';

const dmhyResponse = {
    type: 'object',
    properties: {
        rss: {
            type: 'object',
            properties: {
                channel: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 1,
                    items: {
                        type: 'object',
                        properties: {
                            item: {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'object',
                                    properties: {
                                        title: {
                                            type: 'array',
                                            minItems: 1,
                                            items: { type: 'string' }
                                        },
                                        category: {
                                            type: 'array',
                                            minItems: 1,
                                            items: { 
                                                type: 'object',
                                                properties: {
                                                    _: { type: 'string' }
                                                },
                                                required: [ '_' ]
                                            }
                                        }
                                    },
                                    required: [ 'title', 'category' ]
                                }
                            }
                        },
                        required: [ 'item' ]
                    }
                }
            },
            required: [ 'channel' ]
        }
    },
    required: [ 'rss' ]
};

module.exports = {
    dmhyResponse
};