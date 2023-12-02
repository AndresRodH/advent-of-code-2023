const input = await Bun.file(`${import.meta.dir}/input.txt`).text();

const result = input
	.trim()
	.split("\n")
	.reduce((sum, line) => {
		const characters = line.split("");
		const numbers = characters.filter((character) =>
			Number.isInteger(Number(character)),
		);

		return sum + Number(`${numbers[0]}${numbers.at(-1)}`);
	}, 0);

console.log(result);
