import { Logger,ILogObj,ISettingsParam } from 'tslog'
import { promises as fsPromises } from 'fs';

// Logger settings
const settings = {
  prettyLogTemplate: "{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t[{{filePathWithLine}}{{name}}]\t",
  prettyErrorTemplate: "\n{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}",
  prettyErrorStackTemplate: "  • {{fileName}}\t{{method}}\n\t{{filePathWithLine}}",
  prettyErrorParentNamesSeparator: ":",
  prettyErrorLoggerNameDelimiter: "\t",
  stylePrettyLogs: true,
  prettyLogTimeZone: "UTC",
  prettyLogStyles: {
    logLevelName: {
      "*": ["bold", "black", "bgWhiteBright", "dim"],
      SILLY: ["bold", "white"],
      TRACE: ["bold", "whiteBright"],
      DEBUG: ["bold", "green"],
      INFO: ["bold", "blue"],
      WARN: ["bold", "yellow"],
      ERROR: ["bold", "red"],
      FATAL: ["bold", "redBright"],
    },
    dateIsoStr: "white",
    filePathWithLine: "blackBright",
    name: ["white", "bold"],
    nameWithDelimiterPrefix: ["white", "bold"],
    nameWithDelimiterSuffix: ["white", "bold"],
    errorName: ["bold", "bgRedBright", "whiteBright"],
    fileName: ["yellow"],
    fileNameWithLine: "white",
  },
} as ISettingsParam<ILogObj>;

export class LoggerService {
	public logger: Logger<ILogObj>;
	public logToFile: boolean;
	public logFilePath: string | undefined;

	constructor(logToFile: boolean = false, logFilePath?: string) {
		this.logger = new Logger(settings);
		this.logToFile = logToFile;
    this.logFilePath = logFilePath;
	}

	private async logToFileIfEnabled(level: string, message: string) {
    if (this.logToFile && this.logFilePath) {
      try {
        const logLine = `[${new Date().toISOString()}] [${level}] ${message}\n`;
        await fsPromises.appendFile(this.logFilePath, logLine);
      } catch (err) {
        console.error('Error writing to log file:', err);
      }
    }
  }

	

	silly(...args: unknown[]) {
		this.logger.silly('\n' ,...args)
		this.logToFileIfEnabled('silly', args.join(' '));
	}
	trace(...args: unknown[]) {
		this.logger.trace('\n' ,...args)
		this.logToFileIfEnabled('trace', args.join(' '));
	}
	debug(...args: unknown[]) {
		this.logger.debug('\n' ,...args)
		this.logToFileIfEnabled('debug', args.join(' '));
	}
	log(...args: unknown[]) {
		this.logger.info('\n' ,...args)
		this.logToFileIfEnabled('info',  args.join(' '));
	}
	warn(...args: unknown[]) {
		this.logger.warn('\n' ,...args)
		this.logToFileIfEnabled('warn', args.join(' '));
	}
	error(...args: unknown[]) {
		this.logger.error('\n' ,...args)
		this.logToFileIfEnabled('error', args.join(' '));
	}
	fatal(...args: unknown[]) {
    this.logger.fatal('\n' , new Error(...args as string[]));
		this.logToFileIfEnabled('fatalError', args.join(' '));
	}

	public setLogToFile(logToFile: boolean, logFilePath?: string) {
    if (this.logToFile !== logToFile) {
      this.logToFile = logToFile;
      this.logFilePath = logToFile ? logFilePath : undefined;
    }
  }
}