const input = await Bun.file(`${import.meta.dir}/input.txt`).text();

const [seedsLine, ...mapEntries] = input.trim().split("\n\n");

const seeds = (seedsLine.split(":")[1].match(/\d+/g) ?? []).map(Number);

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

const min = seeds.reduce((min, seed) => {
	let mappedSeed = seed;

	for (const map of maps) {
		for (const [destination, source, range] of map) {
			if (mappedSeed >= source && mappedSeed < source + range) {
				mappedSeed = destination + mappedSeed - source;
				break;
			}
		}
	}

	return Math.min(min, mappedSeed);
}, Number.POSITIVE_INFINITY);

console.log(min);
