const input = await Bun.file(`${import.meta.dir}/input.txt`).text();

const lines = input.split("\n");

const result = lines.reduce((sum, line) => {
	const characters = line.split("");
	const numbers = characters.filter((character) =>
		Number.isInteger(Number(character)),
	);

	return numbers.length > 0
		? sum + Number(`${numbers[0]}${numbers.at(-1)}`)
		: sum;
}, 0);

console.log(result);
