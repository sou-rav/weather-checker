const clothesIdentifiers = Object.freeze({
	'cap': 'Cap',
	'shoe-covers': 'Shoe covers',
	'winter-gloves': 'Winter gloves',
	'jacket': 'Jacket',
	'thick-long-sleeved-jersey': 'Thick long sleeved jersey',
	'long-sleeve-base-layer': 'Long sleeve base layer',
	'bib-tights': 'Bib tights',
	'bib-shorts-leg-warmers': 'Bib shorts + leg warmers',
	'thin-long-sleeved-jersey': 'Thin long sleeved jersey',
	'mid-weight-gloves': 'Mid weight gloves',
	'base-layer': 'Base layer',
	'bib-shorts': 'Bib shorts',
	'thin-gloves': 'Thin gloves',
	'thick-short-sleeved-jersey': 'Thick short sleeved jersey',
	'thin-short-sleeved-jersey': 'Thin short sleeved jersey'
});

interface Temperatures {
	from: number;
	to: number;
}

interface ClothesTemperatureRange {
	temperatures: Temperatures;
	clothesIDs: Array<keyof typeof clothesIdentifiers>;
};

const clothesMapping: ClothesTemperatureRange[] = [{
	temperatures: {
		from: 19,
		to: Infinity
	},
	clothesIDs: [
		"bib-shorts",
		"thin-short-sleeved-jersey"
	]
}, {
	temperatures: {
		from: 17,
		to: 18
	},
	clothesIDs: [
		"bib-shorts",
		"thick-short-sleeved-jersey"
	]
}, {
	temperatures: {
		from: 15,
		to: 16
	},
	clothesIDs: [
		"bib-shorts",
		"thick-short-sleeved-jersey"
	]
}, {
	temperatures: {
		from: 13,
		to: 14
	},
	clothesIDs: [
		"bib-shorts",
		"thick-long-sleeved-jersey",
		"thin-gloves"
	]
}, {
	temperatures: {
		from: 10,
		to: 12
	},
	clothesIDs: [
		"bib-shorts",
		"base-layer",
		"thin-long-sleeved-jersey",
		"mid-weight-gloves"
	]
}, {
	temperatures: {
		from: 8,
		to: 9
	},
	clothesIDs: [
		"bib-shorts-leg-warmers",
		"base-layer",
		"thick-long-sleeved-jersey",
		"mid-weight-gloves"
	]
}, {
	temperatures: {
		from: 6,
		to: 7
	},
	clothesIDs: [
		"bib-tights",
		"long-sleeve-base-layer",
		"thick-long-sleeved-jersey",
		"winter-gloves"
	]
}, {
	temperatures: {
		from: 4,
		to: 5
	},
	clothesIDs: [
		"bib-tights",
		"long-sleeve-base-layer",
		"thick-long-sleeved-jersey",
		"winter-gloves",
		"cap"
	]
}, {
	temperatures: {
		from: 3,
		to: -Infinity
	},
	clothesIDs: [
		"bib-tights",
		"long-sleeve-base-layer",
		"thick-long-sleeved-jersey",
		"jacket",
		"winter-gloves",
		"shoe-covers",
		"cap"
	]
}];


function calculateClothes(currentTemperature: number) {
	currentTemperature = Math.round(currentTemperature);

	const {
		clothesIDs,
		temperatures
	}: any = clothesMapping.find(({temperatures}) => {
		const isInRange =
			currentTemperature >= temperatures.from 
			&& currentTemperature <= temperatures.to;
		
		return isInRange;
	});
	
	const individualItems = clothesIDs.map((clothesID: any) => {
		return [clothesID, (clothesIdentifiers as any)[clothesID]]
	});

	return {
		individualItems,
		mainImage: `outfit-${temperatures.from}-${temperatures.to}.png`
	}
}

export default calculateClothes;