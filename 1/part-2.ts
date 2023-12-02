const Digit = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
};

const input = await Bun.file(`${import.meta.dir}/input.txt`).text();

const result = input
	.trim()
	.split("\n")
	.reduce((sum, line) => {
		const numbers: Array<{ value: number; index: number }> = [];

		for (const digit of Object.keys(Digit)) {
			let lastIndex: number = 0;

			while (lastIndex !== -1) {
				const index = line.indexOf(digit, lastIndex);
				if (index !== -1) {
					numbers.push({ value: Digit[digit as keyof typeof Digit], index });
					lastIndex = index + 1;
				} else {
					break;
				}
			}
		}

		for (let i = 0; i < line.length; i++) {
			const character = line.at(i);
			if (!Number.isNaN(Number(character))) {
				numbers.push({ value: Number(character), index: i });
			}
		}

		const values = numbers
			.sort((a, b) => a.index - b.index)
			.map((number) => number.value);

		return sum + Number(`${values[0]}${values.at(-1)}`);
	}, 0);

console.log(result);
