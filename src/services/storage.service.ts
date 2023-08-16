import { promises as fsPromises, existsSync } from 'fs';
import { join, dirname, } from 'path';
import { fileURLToPath } from 'url';

const rootPath = dirname(dirname(fileURLToPath(import.meta.url)));

export const createPath = (path: string | string[]): string => {
    if (Array.isArray(path)) {
        return join(rootPath, ...path)

    } else { return join(rootPath, path) }
}

export const settingFilePath = createPath('store/setting.json')

export const isExist = async (path: string): Promise<boolean> => {
    try {
        await fsPromises.stat(path);
        return true;
    } catch (err) {
        return false;
    }
};

export const writeFile = async (path: string, data: string, rewrite?: boolean): Promise<boolean> => {
    try {
        const directory = dirname(path);

        if (!existsSync(directory)) {
            await fsPromises.mkdir(directory);
            await fsPromises.writeFile(path, data, 'utf-8');
        } else {
            await fsPromises.appendFile(path, data, 'utf-8');
        }

        if (rewrite) {
            await fsPromises.writeFile(path, data, 'utf-8');
        }

        return true;
    } catch (err) {
        console.error(`Error writing to ${path} file:`, err);
        return false;
    }
};

export const getKeyValue = async (key: string | string[]) => {
    if (await isExist(settingFilePath)) {
        const file = await fsPromises.readFile(settingFilePath);
        const data = JSON.parse(file.toString()); // Parse the Buffer as a string
        if (typeof key === 'string') {
            return data[key];
        } else if (Array.isArray(key)) {
            const result: { [key: string]: any } = {};
            for (const k of key) {
                result[k] = data[k];
            }
            return result;
        }
    } else {
        return undefined;
    }
};
