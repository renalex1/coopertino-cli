import { LoggerService } from "./logger/logger.service"


async function start() {
	const f = new LoggerService()
	f.debug('debug')
	f.log('log')
	f.silly('silly')
	f.trace('trace')
	f.warn('warn')
	f.error('err')
	// f.setLogToFile(true, './logs/logfile.log');
	f.fatal('fatal')
	// f.setLogToFile(false);
}

start()