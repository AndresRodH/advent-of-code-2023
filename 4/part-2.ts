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
	.reduce(
		(acc, line, index) => {
			const id = index + 1;
			const lists = line.split(":")[1].split("|");

			acc[id] = acc[id] ? acc[id] + 1 : 1;

			const scratchcards = acc[id];

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

			const matching = winningNumbers.filter((number) =>
				ours.includes(number),
			).length;

			if (matching > 0) {
				const nextIds = Array.from({ length: matching }).map(
					(_, i) => id + 1 + i,
				);

				for (const nextId of nextIds) {
					acc[nextId] = acc[nextId] ? acc[nextId] + scratchcards : scratchcards;
				}
			}

			return acc;
		},
		{} as Record<number, number>,
	);

console.log(Object.values(result).reduce((sum, number) => sum + number, 0));
