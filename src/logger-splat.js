const { createLogger, transports, format } = require('winston');
const { combine, splat, printf } = format;

const rest = (info) => JSON.stringify(Object.assign({}, info, {
	level: undefined,
	message: undefined,
	splat: undefined,
	label: undefined
}));


let logger = createLogger({
	transports: [
		new transports.Console()
	],
	format: combine(
		splat(),
		printf(info => `${info.level}:[${info.label}] ${info.message} ${rest(info)}`)
	)
});

logger.log(
	'info',
	'any message',
	{
		label: 'label!',
		extra: true
	}
);

logger.log(
	'info',
	'let\'s %s some %s',
	'interpolate',
	'splat parameters',
	{
		label: 'label!',
		extra: true
	}
);

logger.log(
	'info',
	'first is a string %s [[%j]]',
	'behold a string',
	{ beAware: 'this will interpolate' },
	{
		label: 'label!',
		extra: true
	}
);

logger.log(
	'info',
	'first is an object [[%j]]',
	{ beAware: 'this will interpolate' },
	{
		label: 'label!',
		extra: true
	}
);

// //
// // Non-enumerable properties (such as "message" and "stack" in Error
// // instances) will not be merged into any `info`.
// //
const terr = new Error('lol please stop doing this');
terr.label = 'error';
terr.extra = true;
logger.log(
	'info',
	'any message',
	terr
);

logger.log(
	'info',
	'let\'s %s some %s',
	'interpolate',
	'splat parameters',
	terr
);
