const input = await Bun.file(`${import.meta.dir}/input.txt`).text();

const [seedsLine, ...mapEntries] = input.trim().split("\n\n");

const seedSpecs = (seedsLine.split(":")[1].match(/\d+/g) ?? []).map(Number);

type SeedRange = [start: number, end: number];
const seeds: SeedRange[] = [];

for (let i = 0; i < seedSpecs.length; i += 2) {
	const start = seedSpecs[i];
	const length = seedSpecs[i + 1];

	seeds.push([start, start + length - 1]);
}

type ConversionMap = [destination: number, source: number, range: number][];
const maps: ConversionMap[] = [];

for (const entry of mapEntries) {
	const [, ...parts] = entry.split("\n");
	const map: ConversionMap = [];

	for (const part of parts) {
		const [destination, source, range] = part.trim().split(" ");
		map.push([Number(destination), Number(source), Number(range)]);
	}

	maps.push(map);
}

const maxPossibleLocation =
	maps.at(-1)?.reduce((max, [destination, , range]) => {
		return Math.max(max, destination + range);
	}, 0) ?? 0;

let lowestLocation: number | undefined;

for (
	let location = 0;
	location < maxPossibleLocation && typeof lowestLocation === "undefined";
	location++
) {
	let mappedLocation = location;

	for (let i = maps.length - 1; i >= 0; i--) {
		const map = maps[i].find(
			([destination, , range]) =>
				mappedLocation >= destination && mappedLocation < destination + range,
		);
		if (map) {
			const [destination, source] = map;
			mappedLocation = mappedLocation - destination + source;
		}
	}

	for (
		let i = 0;
		i < seeds.length && typeof lowestLocation === "undefined";
		i++
	) {
		const [start, end] = seeds[i];
		if (mappedLocation >= start && mappedLocation <= end) {
			lowestLocation = location;
		}
	}
}

console.log(lowestLocation);
