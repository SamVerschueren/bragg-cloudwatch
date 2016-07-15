import test from 'ava';
import * as event from './fixtures/event.json';
import * as snsEvent from './fixtures/sns-event.json';
import m from './';

const fn = async (t, event, opts) => {
	const ctx = Object.assign({}, {req: event}, t.context.ctx);
	await m(opts)(ctx);
	return ctx;
};

test.beforeEach(t => {
	t.context.ctx = {
		request: {},
		throw: (code, msg) => {
			throw new Error(`${code} - ${msg}`);
		}
	};
});

test('do nothing if it\'s not a cloudwatch event', async t => {
	const result = await fn(t, snsEvent);
	t.falsy(result.request.body);
	t.falsy(result.path);
	t.falsy(result.method);
});

test('path mapping', async t => {
	const result = await fn(t, event, {testFilter: 'foo'});
	t.is(result.path, 'cloudwatch:foo');
});

test('result', async t => {
	const result = await fn(t, event);
	t.is(result.path, 'cloudwatch:testFilter');
	t.is(result.method, 'post');
	t.deepEqual(result.request.body, [
		{
			id: 'eventId1',
			timestamp: 1440442987000,
			message: '[ERROR] First test message'
		},
		{
			id: 'eventId2',
			timestamp: 1440442987001,
			message: '[ERROR] Second test message'
		}
	]);
});
