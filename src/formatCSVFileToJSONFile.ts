import { readFile, writeFile } from 'node:fs/promises';
import { csvToJSON } from './csvToJSON';

export async function formatCSVFileToJSONFile(input: string, output: string, delimiter: string): Promise<void> {
    try {
        if(!input || !output) {
            throw new Error("Необходимо указать корректный путь");
        }
        const csvstring = await readFile(input, 'utf-8');

        const lines = csvstring.trim().split('\n');

        const result = csvToJSON(lines, delimiter);

        await writeFile(output, JSON.stringify(result, null, 2));
    }
    catch (error) {
        if(error.message.includes('ENOENT')) {
            throw new Error(`Ошибка чтения файла: ${input}`);
        }
        if(error.message.includes('EACCES')) {
            throw new Error(`Ошибка записи в файл: ${output}`);
        }
        throw new Error(error);
    }
}