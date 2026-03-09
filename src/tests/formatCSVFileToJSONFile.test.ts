import { describe, it, expect, vi, beforeEach } from 'vitest'
import { formatCSVFileToJSONFile } from "../formatCSVFileToJSONFile";
import { readFile, writeFile } from 'node:fs/promises';

vi.mock('node:fs/promises', () => ({
    readFile: vi.fn(),
    writeFile: vi.fn()
}));

const fakeReadFile = vi.mocked(readFile);
const fakeWriteFile = vi.mocked(writeFile);

describe('formatCSVFileToJSONFile function', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Корректный ввод и вывод', async () => {
        fakeReadFile.mockResolvedValue("p1;p2\n1;A\n2;B");
        await formatCSVFileToJSONFile('./in.csv', './out.json', ';');

        expect(fakeReadFile).toHaveBeenCalledWith('./in.csv', 'utf-8');
        expect(fakeWriteFile).toHaveBeenCalledWith(
            './out.json',
            JSON.stringify([
                { p1: 1, p2: 'A'},
                { p1: 2, p2: 'B'}
            ], null, 2)
        );
    });

    it('Передача некорректных параметров', async () => {
        await expect(() => formatCSVFileToJSONFile('', './out.json', ';')).rejects.
            toThrowError("Error: Необходимо указать корректный путь");

        await expect(() => formatCSVFileToJSONFile('./in.csv', '', ';')).rejects.
            toThrowError("Error: Необходимо указать корректный путь");
    });

    it('Входной файл не найден', async () => {
        fakeReadFile.mockRejectedValue(new Error('ENOENT'));

        await expect(() => formatCSVFileToJSONFile('./in.csv', './out.json', ';')).rejects.
            toThrowError("Ошибка чтения файла: ./in.csv");
    });

    it('Пустой csv файл', async () => {
        fakeReadFile.mockResolvedValue('');
        await expect(formatCSVFileToJSONFile('./in.csv', './out.json', ';')).rejects.
            toThrowError('Error: Некорректная передача параметра input!');
    });

    it('Ошибка записи в файл', async () => {
        fakeReadFile.mockResolvedValue("p1;p2\n1;A\n2;B");
        fakeWriteFile.mockRejectedValue(new Error('EACCES'));
        
        await expect(formatCSVFileToJSONFile('./in.csv', './out.json', ';')).rejects.
            toThrowError('Ошибка записи в файл: ./out.json');
    });
});