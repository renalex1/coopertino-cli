import { promises as fsPromises, existsSync } from 'fs';
import { join, dirname, } from 'path';
import { fileURLToPath } from 'url';

// const rootPath = dirname(require.main!.filename)
const rootPath = dirname(dirname(fileURLToPath(import.meta.url)));


export const createPath = (path: string | string[]): string => {
    if (Array.isArray(path)) {
        return join(rootPath, ...path)

    } else { return join(rootPath, path) }
}

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