const path = require('path');
const moment = require('moment');

const winston = require('winston');
const { format } = winston;
const { combine, printf, label, timestamp, splat, simple } = format;

const testFormat = format((info, option) => {
	/*
		format(function(info,option))
			- info: 上一个format处理后的信息
			- option: 调用format传入的参数
			return: 为下一个format拿到的信息
	*/
	info.test = option.result;
	return info;
});

const customFormat = printf(({ level, message, label, timestamp, test }) => {
	return `${level}:[${label}] ${message} ${timestamp} ${test}`;
});

const getFormatTime = () => moment().format('YYYY-MM-DD hh:mm:ss');

const logger = winston.createLogger({
	level: 'info',
	format: combine(
		label({ label: 'test' }),
		timestamp({
			format: getFormatTime
		}),
		splat(),
		simple(),
		testFormat({
			result: '\nmy format function at next line'
		}),
		customFormat
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: path.resolve(__dirname, '../log/combined.log')
		})
	]
});

logger.log({
	level: 'info',
	message: 'hello winston, my name is %s and I have been working for %d year.',
	splat: ['ang', 1]
});