import { csvToJSON } from "./csvToJSON";

let res = csvToJSON(["p1;p2;p3:p4", "1;A;b;c", "2;B;v;d"], ';');
//["p1: 1", "p2: A", "p3: b", "p4: c"]

console.log(res);