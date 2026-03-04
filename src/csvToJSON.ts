export function csvToJSON(input: string[], delimiter: string) {
    const result: string[] = [];

    const header = input[0].split(delimiter);

    for(let i = 0; i < input.length; i++) {
        const values = input[i].split(delimiter);

        for (let j = 0; header.length; j++) {
            result.push(`${header[j]}: ${values[j]}`)
        }
    }

    return result;
}
