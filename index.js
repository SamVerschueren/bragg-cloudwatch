'use strict';
const zlib = require('zlib');
const pify = require('pify');

const gunzip = pify(zlib.gunzip.bind(zlib));

module.exports = opts => {
	opts = opts || {};

	return ctx => {
		if (!ctx.path && ctx.req.awslogs && ctx.req.awslogs.data) {
			const payload = new Buffer(ctx.req.awslogs.data, 'base64');

			return gunzip(payload)
				.then(result => {
					result = JSON.parse(result.toString('utf8'));

					if (result.logEvents && result.subscriptionFilters && result.subscriptionFilters.length > 0 && result.messageType === 'DATA_MESSAGE') {
						const filter = result.subscriptionFilters[0];

						ctx.request.body = result.logEvents;
						Object.defineProperty(ctx, 'path', {enumerable: true, value: `cloudwatch:${opts[filter] || filter}`});
						Object.defineProperty(ctx, 'method', {enumerable: true, value: 'post'});
					}
				})
				.catch(() => {
					// do nothing upon failure
				});
		}
	};
};
