import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const rootPath = dirname(fileURLToPath(import.meta.url));


const srcDir = join(rootPath, 'src', 'utils','locales');
const distDir = join(rootPath, 'dist', 'utils','locales');

// Recursively copy a source directory to a destination directory
const copyDirectory = (src, dest) => {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    entries.forEach((entry) => {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else if (entry.isFile()) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied file: ${srcPath} to ${destPath}`);
        }
    });
};

copyDirectory(srcDir, distDir);
console.log('All files and folders copied.');