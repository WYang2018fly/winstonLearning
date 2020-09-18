const path = require('path');
const moment = require('moment');

const { createLogger, transports, format } = require('winston');
const { debug } = require('console');
const { combine, printf, label, timestamp, splat } = format;

const rest = (info) => JSON.stringify(Object.assign({}, info, {
	level: undefined,
	message: undefined,
	splat: undefined,
	label: undefined,
	timestamp: undefined
}));

const customFormat = printf((info) => `${info.level}:[${info.label}] ${info.message} ${info.timestamp} ${rest(info) === '{}' ? '' : rest(info)}`);

const getFormatTime = () => moment().format('YYYY-MM-DD HH:mm:ss');

// const metadataFormat = format((info, options) => {
// 	console.log(`test: ${info.test}`);
// 	return info;
// });

const logger = createLogger({
	level: 'info',
	format: combine(
		label({ label: 'test-infoParameters' }),
		timestamp({
			format: getFormatTime
		}),
		// splat(),
		// metadataFormat(),
		customFormat
	),
	transports: [
		new transports.Console(),
		new transports.File({
			filename: path.resolve(__dirname, '../log/combined-infoParamters.log')
		})
	]
});

const logger2 = createLogger({
	level: 'info',
	format: combine(
		label({ label: 'test-infoParameters' }),
		timestamp({
			format: getFormatTime
		}),
		splat(),
		// metadataFormat(),
		customFormat
	),
	transports: [
		new transports.Console(),
		new transports.File({
			filename: path.resolve(__dirname, '../log/combined-infoParamters.log')
		})
	]
});

/**
 * logger.log()
 * logger.info()
 * ...
 */

//one parameters 
//level[LEVEL] = level.level; 
//logger.log('info'); //TypeError: Cannot create property 'Symbol(level)' on string 'info'

//two parameters
logger.log('info', 'hello winston1');

//three more parameters

//Supports the existing API
logger.log('info', 'hello winston2', 'string meta'); //disappear
logger.log('info', 'hello winston2', { custom: true });

//any { message } property in a meta object provided will automatically be concatenated to any msg already provided
logger.log('info', 'hello winston3', { message: 'hello again', custom: true });
logger.log('info', new Error('Yo, it\'s on fire'));

logger.log({ level: 'info', message: 'hello winston4', custom: true });
logger.log({ level: 'info', message: new Error('Yo, it\'s on fire') });

logger.info('hello winston8');
logger.info('hello winston9', { custom: true });
logger.info('hello winston10', { message: 'hello again', custom: true });

console.log('==============================================================');
//Requires winston.format.splat()

//message is overridden by metadata
logger2.log('info', 'hello winston', { message: 'hello again', custom: true });

logger2.format = combine(
	label({ label: 'test-infoParameters2' }),
	timestamp({
		format: getFormatTime
	}),
	splat(),
	customFormat
);
logger2.log('info', 'hello winston5 %s', 'hello again');
logger2.log('info', 'hello winston6 %s %d', 'hello again', Math.random());

logger2.log({
	level: 'info',
	message: 'hello winston7 %s %d%%',
	splat: ['A string', 50],
	meta: { thisIsMeta: true }
});

logger2.info('hello winston5 %s', 'hello again');
logger2.info('hello winston6 %s %d', 'hello again', Math.random());

logger2.info({
	message: 'hello winston7 %s %d%%',
	splat: ['A string', 50],
	meta: { thisIsMeta: true }
});
