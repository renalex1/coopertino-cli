import { Logger, ILogObj, ISettingsParam } from 'tslog'
import { promises as fsPromises } from 'fs';
import { join, dirname, basename } from 'path';

export const rootPath = dirname(require.main!.filename)

export const isExist = async (path: string): Promise<boolean> => {
  try {
    await fsPromises.stat(path);
    return true;
  } catch (err) {
    return false;
  }
};

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
  public logFilePath: string;

  constructor(logToFile: boolean = false, logFilePath = '/logs/logs.log') {
    this.logger = new Logger(settings);
    this.logToFile = logToFile;
    this.logFilePath = logFilePath;
  }

  private async logToFileIfEnabled(level: string, message: string) {
    console.log(11);

    const dirPath = join(rootPath, dirname(this.logFilePath))
    const filePath = join(dirPath, basename(this.logFilePath))
    console.log(this.logToFile);
    await isExist(dirPath).then(async (info) => {
      console.log(1);
      console.log(info);
      if (info === false) {
        await fsPromises.mkdir(dirPath)
      }
      console.log(4);
      console.log(filePath);
      console.log(this.logToFile);

      if (filePath && this.logToFile) {

        try {
          const logLine = `[${new Date().toISOString()}] [${level}] ${message}\n`;
          await fsPromises.appendFile(filePath, logLine);
        } catch (err) {
          console.error('Error writing to log file:', err);
        }
      }
    })
  }



  async silly(...args: unknown[]) {
    this.logger.silly('\n', ...args)
    await this.logToFileIfEnabled('silly', args.join(' '));
  }
  async trace(...args: unknown[]) {
    this.logger.trace('\n', ...args)
    await this.logToFileIfEnabled('trace', args.join(' '));
  }
  debug(...args: unknown[]) {
    this.logger.debug('\n', ...args)
    this.logToFileIfEnabled('debug', args.join(' '));
  }
  log(...args: unknown[]) {
    this.logger.info('\n', ...args)
    this.logToFileIfEnabled('info', args.join(' '));
  }
  warn(...args: unknown[]) {
    this.logger.warn('\n', ...args)
    this.logToFileIfEnabled('warn', args.join(' '));
  }
  error(...args: unknown[]) {
    this.logger.error('\n', ...args)
    this.logToFileIfEnabled('error', args.join(' '));
  }
  fatal(...args: unknown[]) {
    this.logger.fatal('\n', new Error(...args as string[]));
    this.logToFileIfEnabled('fatalError', args.join(' '));
  }

  public setLogToFile(logToFile: boolean, logFilePath?: string) {
    // console.log(1);
    // console.log(this.logToFile );

    if (this.logToFile !== logToFile) {
      this.logToFile = logToFile;
      this.logFilePath = logToFile ? (logFilePath ? logFilePath : '/logs/logs.log') : '';
    }
    console.log(2);
    // console.log(this.logToFile );
  }
}

/*

  const f = new LoggerService()

  # this will write to './logs/logs.log'
  f.setLogToFile(true);  // Start
  f.silly('silly')
  f.trace('trace')
  f.setLogToFile(false);  // Stop

  # this will write to where you set path
  f.setLogToFile(true, './logs/logFile.log');    //Start
  f.fatal('fatal')
  f.setLogToFile(false);  // Stop

*/