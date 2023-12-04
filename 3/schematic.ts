type SymbolKey = `${number},${number}`;
type NumberKey = `${number}:${number},${number}`;

export class Schematic {
	readonly input: string;
	readonly #entries: string[];
	readonly entryLength: number;
	readonly totalEntries: number;
	readonly #symbols = new Map<SymbolKey, string>();
	readonly #numbers = new Map<NumberKey, number>();

	constructor(input: string) {
		this.input = input.trim();
		this.#entries = this.input.split("\n");
		this.totalEntries = this.#entries.length;
		this.entryLength = this.#entries[0].length;

		for (let y = 0; y < this.#entries.length; y++) {
			const line = this.#entries[y];

			let xNumberStart: number | null = null;
			let numberString = "";

			for (let x = 0; x < line.length; x++) {
				const value = line[x];

				if (value === "." && xNumberStart !== null) {
					this.#numbers.set(
						this.#getNumberKey({ x: { start: xNumberStart, end: x - 1 }, y }),
						Number(numberString),
					);

					xNumberStart = null;
					numberString = "";
				} else if (this.#isSymbol(value)) {
					this.#symbols.set(this.#getSymbolKey({ x, y }), value);

					if (xNumberStart !== null) {
						this.#numbers.set(
							this.#getNumberKey({ x: { start: xNumberStart, end: x - 1 }, y }),
							Number(numberString),
						);

						xNumberStart = null;
						numberString = "";
					}
				} else if (Number.isInteger(Number(value))) {
					if (xNumberStart === null) {
						xNumberStart = x;
					}

					numberString += value;
				}
			}

			if (xNumberStart !== null) {
				this.#numbers.set(
					this.#getNumberKey({
						x: { start: xNumberStart, end: line.length - 1 },
						y,
					}),
					Number(numberString),
				);
			}
		}
	}

	#getSymbolKey({ x, y }: { x: number; y: number }): SymbolKey {
		return `${x},${y}`;
	}

	#getNumberKey({
		x,
		y,
	}: { x: { start: number; end: number }; y: number }): NumberKey {
		return `${x.start}:${x.end},${y}`;
	}

	#isSymbol(value: unknown) {
		return (
			typeof value === "string" && value !== "." && Number.isNaN(Number(value))
		);
	}

	#range(start: number, end: number) {
		return Array.from({ length: end - start + 1 }).map((_, i) => start + i);
	}

	#hasNeighbourSymbol({
		x,
		y,
	}: { x: { start: number; end: number }; y: number }) {
		const up = y - 1 < 0 ? null : y - 1;
		const left = x.start - 1 < 0 ? null : x.start - 1;
		const right = x.end + 1 > this.entryLength - 1 ? null : x.end + 1;
		const down = y + 1 > this.totalEntries - 1 ? null : y + 1;

		let neighbours: { x: number; y: number }[] = [];

		// diagonal up left
		if (left && up) {
			neighbours.push({ x: left, y: up });
		}
		// top range
		if (up) {
			const range = this.#range(x.start, x.end).map((x) => ({ x, y: up }));
			neighbours = [...neighbours, ...range];
		}
		// diagonal up right
		if (right && up) {
			neighbours.push({ x: right, y: up });
		}
		// left
		if (left) {
			neighbours.push({ x: left, y });
		}
		// right
		if (right) {
			neighbours.push({ x: right, y });
		}
		// diagonal down left
		if (left && down) {
			neighbours.push({ x: left, y: down });
		}
		// bottom range
		if (down) {
			const range = this.#range(x.start, x.end).map((x) => ({ x, y: down }));
			neighbours = [...neighbours, ...range];
		}
		// diagonal down right
		if (right && down) {
			neighbours.push({ x: right, y: down });
		}

		return neighbours.some(({ x, y }) => {
			const symbolKey = this.#getSymbolKey({ x, y });
			return this.#symbols.has(symbolKey);
		});
	}

	get parts() {
		const parts: {
			partNumber: number;
			coordinates: {
				x: { start: number; end: number };
				y: number;
			};
		}[] = [];

		for (const [key, value] of this.#numbers.entries()) {
			const [xRange, yString] = key.split(",");
			const [xStart, xEnd] = xRange.split(":");

			const x = { start: Number(xStart), end: Number(xEnd) };
			const y = Number(yString);

			if (this.#hasNeighbourSymbol({ x, y })) {
				parts.push({
					coordinates: { x, y },
					partNumber: value,
				});
			}
		}

		return parts;
	}
}
