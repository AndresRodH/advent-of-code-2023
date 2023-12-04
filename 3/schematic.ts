type SymbolKey = `${number},${number}`;
type NumberKey = `${number}:${number},${number}`;

type Part = {
	partNumber: number;
	coordinates: {
		x: { start: number; end: number };
		y: number;
	};
};

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

		this.#parseInput();
	}

	#parseInput() {
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

	#getNeighborCoordinates(coordinates: { x: number; y: number }): {
		x: number;
		y: number;
	}[];
	#getNeighborCoordinates(coordinates: {
		x: { start: number; end: number };
		y: number;
	}): { x: number; y: number }[];
	#getNeighborCoordinates(coordinates: {
		x: number | { start: number; end: number };
		y: number;
	}): { x: number; y: number }[] {
		const y = coordinates.y;
		const x =
			typeof coordinates.x === "number"
				? { start: coordinates.x, end: coordinates.x }
				: coordinates.x;
		const up = y - 1 < 0 ? null : y - 1;
		const left = x.start - 1 < 0 ? null : x.start - 1;
		const right = x.end + 1 > this.entryLength - 1 ? null : x.end + 1;
		const down = y + 1 > this.totalEntries - 1 ? null : y + 1;

		let neighbors: { x: number; y: number }[] = [];

		// diagonal up left
		if (left && up) {
			neighbors.push({ x: left, y: up });
		}
		// top range
		if (up) {
			const range = this.#range(x.start, x.end).map((x) => ({ x, y: up }));
			neighbors = [...neighbors, ...range];
		}
		// diagonal up right
		if (right && up) {
			neighbors.push({ x: right, y: up });
		}
		// left
		if (left) {
			neighbors.push({ x: left, y });
		}
		// right
		if (right) {
			neighbors.push({ x: right, y });
		}
		// diagonal down left
		if (left && down) {
			neighbors.push({ x: left, y: down });
		}
		// bottom range
		if (down) {
			const range = this.#range(x.start, x.end).map((x) => ({ x, y: down }));
			neighbors = [...neighbors, ...range];
		}
		// diagonal down right
		if (right && down) {
			neighbors.push({ x: right, y: down });
		}

		return neighbors;
	}

	#hasNeighborSymbol({
		x,
		y,
	}: { x: { start: number; end: number }; y: number }) {
		const neighbors = this.#getNeighborCoordinates({ x, y });

		return neighbors.some(({ x, y }) => {
			const symbolKey = this.#getSymbolKey({ x, y });
			return this.#symbols.has(symbolKey);
		});
	}

	get parts() {
		const parts: Part[] = [];

		for (const [key, value] of this.#numbers.entries()) {
			const [xRange, yString] = key.split(",");
			const [xStart, xEnd] = xRange.split(":");

			const x = { start: Number(xStart), end: Number(xEnd) };
			const y = Number(yString);

			if (this.#hasNeighborSymbol({ x, y })) {
				parts.push({
					coordinates: { x, y },
					partNumber: value,
				});
			}
		}

		return parts;
	}

	get #asteriskLocations() {
		const asteriskLocations: { x: number; y: number }[] = [];

		for (const [key, symbol] of this.#symbols.entries()) {
			if (symbol !== "*") continue;

			const [x, y] = key.split(",").map(Number);
			asteriskLocations.push({ x, y });
		}

		return asteriskLocations;
	}

	get gears() {
		const parts = this.parts;
		const asteriskLocations = this.#asteriskLocations;
		const gears: [Part, Part][] = [];

		for (const { x, y } of asteriskLocations) {
			const neighboringParts = parts.filter((part) => {
				const neighbors = this.#getNeighborCoordinates(part.coordinates);
				return neighbors.some(
					(neighbor) => neighbor.x === x && neighbor.y === y,
				);
			});

			if (neighboringParts.length === 2) {
				gears.push(neighboringParts as [Part, Part]);
			}
		}

		return gears;
	}
}
