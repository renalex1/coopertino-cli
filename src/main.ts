import { LoggerService, } from './logger/logger.service.js'
import { isExist, createPath, writeFile } from './services/storage.service.js'
import { language } from './services/osLang.service.js'
import { createPromptModule, QuestionCollection, } from 'inquirer';
import { loadTranslation } from './utils/utils.js';
interface UserInfo {
	lang: string;
	username: string;
	password: string;
}


async function start() {
	let translation = await loadTranslation(language);
	const prompt = createPromptModule();

	const f = new LoggerService()

	f.log(language);

	const settingPath = createPath('store/setting.json')
	const setting = await isExist(settingPath)

	if (!setting) {

		const languageResponse = await prompt({
			type: 'list',
			name: 'language',
			message: translation.settings.settings_lang,
			choices: ['en', 'ru'],
			default: language,
		});

		if (await languageResponse.language) {
			translation = await loadTranslation(languageResponse.language);
		}
		const secondQuestions: QuestionCollection[] = [
			{
				type: 'input',
				name: 'username',
				message: translation.settings.settings_username,
			},
			{
				type: 'input',
				name: 'password',
				message: translation.settings.settings_password,
			},
		];

		const answers = await prompt(secondQuestions);

		const info: UserInfo = {
			lang: answers.lang,
			username: answers.username,
			password: answers.password.replace(/#/g, '%23').replace(/&/g, '%26')
	
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
