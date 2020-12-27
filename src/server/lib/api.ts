import fetch from 'node-fetch';
import config from 'config';

const baseAPIURL = config.get('baseAPIURL');
// import {URLSearchParams} from 'url';

import locationsQueries from '../db/queries/locations-queries.js';

const APIKey: string = config.get('ACCU_WEATHER_API_KEY');

async function fetchJSON({
	url,
	params
}: {
	url: string;
	params: {[index: string]: string};
}) {
	const queryString = new URLSearchParams({
		apikey: APIKey,
		...params
	});

	const URLToFetch = `${baseAPIURL}${url}?${queryString.toString()}`;
	console.log('Fetching:', URLToFetch);

	const response = await fetch(URLToFetch);
	return response.json();
}

async function searchForLocation(query: string) {
	const results = await fetchJSON({
		url: '/autocomplete-bright.json', // /locations/v1/cities/autocomplete
		params: {
			q: query
		}
	});

	const formattedResults = results.map((result: any) => {
		return {
			name: result.LocalizedName,
			area: result.AdministrativeArea.LocalizedName,
			country: result.Country.LocalizedName,
			locationKey: result.Key
		};
	});

	return locationsQueries.insertLocations(formattedResults);
}

async function fetchCurrentWeather(locationID: string) {
	return fetchJSON({
		url: '/current-conditions.json', // /currentconditions/v1/${locationKey}
		params: {
			details: String(true)
		}
	});
}

async function fetchLatestForecast(locationKey: string) {
	return fetchJSON({
		url: '/forecast-12-hours.json', // /forecasts/v1/hourly/12hour/${locationKey}
		params: {
			details: String(true),
			metric: String(true)
		}
	});
}

async function getLocationFromLatLon(query: string) {
	const result = await fetchJSON({
		url: '/location-based-on-lat-lon-v2.json', // /locations/v1/cities/geoposition/search
		params: {
			q: query,
			details: String(true)
		}
	});

	return locationsQueries.insertLocations([{
		name: result.LocalizedName,
		area: result.AdministrativeArea.LocalizedName,
		country: result.Country.LocalizedName,
		locationKey: result.Key
	}]);
}

export {
	searchForLocation,
	getLocationFromLatLon,
	fetchLatestForecast,
	fetchCurrentWeather
}