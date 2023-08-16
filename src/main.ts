import { LoggerService, } from './logger/logger.service.js'
import { isExist, createPath, writeFile } from './services/storage.service.js'
import { language } from './services/osLang.service.js'
import { createPromptModule, QuestionCollection } from 'inquirer';
// import inquirer from 'inquirer';
import { loadTranslation } from './utils/utils.js';
interface UserInfo {
	lang: string;
	username: string;
	password: string;
}


async function start() {
	const translation = await loadTranslation(language);
	console.log(translation);

	const prompt = createPromptModule();
	// const prompt = inquirer.createPromptModule();

	const f = new LoggerService()

	f.log(language);

	const settingPath = createPath('store/setting.json')
	const setting = await isExist(settingPath)
	if (!setting) {
		const questions: QuestionCollection[] = [
			{
				type: 'list',
				name: 'lang',
				message: 'Please select display language (English "en" or Russian "ru"): ',
				choices: ['en', 'ru'],
				default: language,
			},
			{
				type: 'input',
				name: 'username',
				message: 'Please enter username: '
			},
			{
				type: 'password',
				name: 'password',
				message: 'Please enter password: '
			}
		];
		// const questions = [
		// 	{
		// 		type: 'list',
		// 		name: 'lang',
		// 		message: 'Please select display language (English "en" or Russian "ru"): ',
		// 		choices: ['en', 'ru'],
		// 		default: language,
		// 	},
		// 	{
		// 		type: 'input',
		// 		name: 'username',
		// 		message: 'Please enter username: ',
		// 	},
		// 	{
		// 		type: 'password',
		// 		name: 'password',
		// 		message: 'Please enter password: ',
		// 	},
		// ];
		const answers = await prompt(questions);

		const info: UserInfo = {
			lang: answers.lang,
			username: answers.username,
			password: answers.password
		};
		await writeFile(settingPath, JSON.stringify(info), true)
	} else {
		await writeFile(settingPath, '{"oo": "kkkk"}', true)

	}

	// f.debug('debug')
	// f.log('log')
	// f.setLogToFile(true);
	// f.silly('silly')
	// f.trace('trace')
	// f.setLogToFile(false);
	// f.setLogToFile(true, '/err/logErr.log');
	// f.error('err')
	// f.setLogToFile(false);
	// f.setLogToFile(true, '/logs/logFile.log');
	// f.warn('warn')
	// // f.fatal('fatal')
	// f.setLogToFile(false);
}

start()

/* 

const answer = await prompt([
	{
		type: 'confirm',
		name: 'proceed',
		message: 'Do you want to continue?',
		default: true,
	},
]);

if (answer.proceed) {
	const questions = [
		{
			type: 'list',
			name: 'lang',
			message: 'Please select display language (English "en" or Russian "ru"): ',
			choices: ['en', 'ru'],
			default: language,
		},
		{
			type: 'input',
			name: 'username',
			message: 'Please enter username: ',
		},
		{
			type: 'password',
			name: 'password',
			message: 'Please enter password: ',
		},
	];

	const answers = await prompt(questions);
	}
*/

/*

const cmd = readline.createInterface(process.stdin, process.stdout)

let info = { lang: '', username: '', password: '' }
		cmd.question(`Please enter display language (English or Russian): `, (lang: string) => {
			info.lang = lang
			cmd.question(`Please enter username: `, (username: string) => {
				info.username = username
				cmd.question(`Please enter password: `, async (password: string) => {
					info.password = password
					f.log(info)
					cmd.close()
					await writeFile(settingPath, JSON.stringify(info), true)
				})
			})
		})

*/

/*


import readline from 'readline';


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


const getInput = (question: string): Promise<string> => new Promise((resolve) => {
	rl.question(question, resolve);
});

const info: UserInfo = {
	lang: await getInput(`Please enter display language (English or Russian): `),
	username: await getInput(`Please enter username: `),
	password: await getInput(`Please enter password: `)
};

await writeFile(settingPath, JSON.stringify(info), true)
console.log(info);
f.log(info);
rl.close();
*/
