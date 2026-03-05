import { readFile, writeFile } from 'node:fs/promises';
import { csvToJSON } from './csvToJSON';

export async function formatCSVFileToJSONFile(input: string, output: string, delimiter: string): Promise<void> {
    try {
        
        const csvstring = await readFile(input, 'utf-8');

        const lines = csvstring.trim().split('\n');

        const result = csvToJSON(lines, delimiter);

        await writeFile(output, JSON.stringify(result, null, 2));
    }
    catch (error) {
        throw new Error(`Ошибка обработки файла: ${error}`);
    }
}