export function csvToJSON(input: string[], delimiter: string) : object[] {
    if(!input || input.length < 2) {
        throw new Error("Некорректная передача параметра input!");
    }

    const result: object[] = [];

    const header = input[0].split(delimiter);

    for(let i = 1; i < input.length; i++) {
        const values = input[i].split(delimiter);

        if(header.length !== values.length) {
            throw new Error("Несовпадение по количеству параметров!");
        }

        const obj: { [key: string]: string | number } = {};
        
        for (let j = 0; j < header.length; j++) {
            if(values[j] === "") {
                throw new Error("Передача пустого значения в параметр функции!"); 
            }
            
            obj[header[j]] = isNaN(Number(values[j])) ? values[j] : Number(values[j]);
        }

        result.push(obj);
    }

    return result;
}
