# About winston
## Basic 
- create logger: `winston.createLogger({level, transport, format, ...})`
- transport: Set of logging targets for info messages
- format: Formatting for info messages

## 1.Logger log parameters
- `logger.log(level,msg,...splat)`
```javascript
//winston/lib/winston/logger.js
function log(level, msg, ...splat) {
	// eslint-disable-line max-params
	// Optimize for the hotpath of logging JSON literals
	if (arguments.length === 1) {
		// Yo dawg, I heard you like levels ... seriously ...
		// In this context the LHS `level` here is actually the `info` so read
		// this as: info[LEVEL] = info.level;
		level[LEVEL] = level.level;
		this._addDefaultMeta(level);
		this.write(level);
		return this;
	}

	// Slightly less hotpath, but worth optimizing for.
	if (arguments.length === 2) {
		if (msg && typeof msg === 'object') {
			msg[LEVEL] = msg.level = level;
			this._addDefaultMeta(msg);
			this.write(msg);
			return this;
		}

		msg = { [LEVEL]: level, level, message: msg };
		this._addDefaultMeta(msg);
		this.write(msg);
		return this;
	}

	const [meta] = splat;
	if (typeof meta === 'object' && meta !== null) {
		// Extract tokens, if none available default to empty array to
		// ensure consistancy in expected results
		const tokens = msg && msg.match && msg.match(formatRegExp);

		if (!tokens) {
			const info = Object.assign({}, this.defaultMeta, meta, {
				[LEVEL]: level,
				[SPLAT]: splat,
				level,
				message: msg
			});

			if (meta.message) info.message = `${info.message} ${meta.message}`;
			if (meta.stack) info.stack = meta.stack;

			this.write(info);
			return this;
		}
	}

	this.write(Object.assign({}, this.defaultMeta, {
		[LEVEL]: level,
		[SPLAT]: splat,
		level,
		message: msg
	}));

	return this;
}
```

## 2.Logger format
- splat: string interpolation
  
- simple: serializes the entire info message

## 3.thought
- without format splat
	> supports the existing API - `logger.info(level,message,metadata)`

	- level [x]: 
	`level[LEVEL] = level.level` 
	- level, message [√]
	- level, message, metadata(object) [√]: 
		message property in meta object provided will automatically be concatenated to any msg already provided
	- level, message, ...splat(other types) [x]
		
- with format splat
	> requires winston.format.splat()	

	- level, message, metadata(object) [√]: message is overridden by metadata
	- level, message, ...metadata(other types) [√]: [util.format()](https://nodejs.org/dist/latest/docs/api/util.html#util_util_format_format_args)