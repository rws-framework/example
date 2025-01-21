import fs from 'fs';
import path from 'path';

import { v4 as uuid } from 'uuid';

async function findClosestFolder(folderName: string, currentPath: string): Promise<string | null> 
{
    return new Promise((resolve, reject) => {
        const possibleFolderPath = path.join(currentPath, folderName);
        if (fs.existsSync(possibleFolderPath) && fs.statSync(possibleFolderPath).isDirectory()) {
            resolve(possibleFolderPath);
        }
    
        const parentPath = path.dirname(currentPath);
        if (parentPath === currentPath) {
            resolve(null); // Reached the root directory without finding the folder
        }
    
        findClosestFolder(folderName, parentPath).then((res) => {
            resolve(res);
        });
    });
}

function uniqid(prefix: string = null): string
{
    return (prefix ? `${prefix}_` : '') + uuid();
}

export default {
    findClosestFolder,
    uniqid
};