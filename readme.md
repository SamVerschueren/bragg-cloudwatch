# bragg-cloudwatch [![Build Status](https://travis-ci.org/SamVerschueren/bragg-cloudwatch.svg?branch=master)](https://travis-ci.org/SamVerschueren/bragg-cloudwatch)

> CloudWatch middleware for [bragg](https://github.com/SamVerschueren/bragg).

This little piece of middleware makes it possible to handle a CloudWatch logstream as if they where normal requests.


## Install

```
$ npm install --save bragg-cloudwatch
```


## Usage

```js
const app = require('bragg')();
const router = require('bragg-router')();
const cloudwatch = require('bragg-cloudwatch');

// Listen for the logstream with the filter name `unicorn`
router.post('cloudwatch:unicorn', ctx => {
	console.log(ctx.request.body);
	//=> [{id: 'eventId1', timestamp: 1440442987000, message: '[ERROR] First error message'}]
});

app.use(cloudwatch());
app.use(router.routes());

exports.handler = app.listen();
```

The `cloudwatch:` prefix is attached by this module and is followed by the name of the filter. The event is provided in the `body` property of the `request` object.


## API

### cloudwatch([options])

#### options

Type: `Object`

Map a filter name to another name.


## Related

- [bragg-sns](https://github.com/SamVerschueren/bragg-sns) - SNS middleware.
- [bragg-dynamodb](https://github.com/SamVerschueren/bragg-dynamodb) - DynamoDB middleware.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
