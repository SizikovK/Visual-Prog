import { csvToJSON } from "./csvToJSON";
import { formatCSVFileToJSONFile } from "./formatCSVFileToJSONFile";

let res = csvToJSON(["p1;p2;p3;p4", "1;A;b;c", "2;B;v;a"], ';');
console.log(res);

formatCSVFileToJSONFile('src/data/examp.csv', 'src/data/ex.json', ',');