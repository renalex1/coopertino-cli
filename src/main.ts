import { LoggerService } from './logger/logger.service'


async function start() {
	const f = new LoggerService()
	// f.debug('debug')
	// f.log('log')
	f.setLogToFile(true);
	f.silly('silly')
	f.trace('trace')
	f.setLogToFile(false);
	f.setLogToFile(true, '/err/logErr.log');
	f.error('err')
	f.setLogToFile(false);
	f.setLogToFile(true, '/logs/logFile.log');
	f.warn('warn')
	// f.fatal('fatal')
	f.setLogToFile(false);
}

start()