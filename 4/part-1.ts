// const input = `
// Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
// Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
// Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
// Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
// Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
// Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
// `;
const input = await Bun.file(`${import.meta.dir}/input.txt`).text();

const result = input
	.trim()
	.split("\n")
	.reduce((sum, line) => {
		const lists = line.split(":")[1].split("|");

		const winningNumbers = lists[0]
			.trim()
			.split(" ")
			.filter((entry) => entry.length > 0)
			.map(Number);
		const ours = lists[1]
			.trim()
			.split(" ")
			.filter((entry) => entry.length > 0)
			.map(Number);

		const points = winningNumbers
			.filter((number) => ours.includes(number))
			.reduce((acc) => {
				return acc === 0 ? 1 : acc * 2;
			}, 0);

		return sum + points;
	}, 0);

console.log(result);
