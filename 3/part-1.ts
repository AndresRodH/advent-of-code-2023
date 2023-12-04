import { Schematic } from "./schematic.ts";

const input = await Bun.file(`${import.meta.dir}/input.txt`).text();

// const schematic = new Schematic(`
// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..
// `);
const schematic = new Schematic(input);

const result = schematic.parts.reduce((sum, part) => sum + part, 0);

console.log(result);
