import knex from '../connection.js';
// Import locationsQueries from './locationsQueries.js';

function formatForecasts(forecasts: string) {
	const parsedForcasts = JSON.parse(forecasts);
	return parsedForcasts.map((forecast: any) => {
		return {
			...formatWeather(forecast),
			time: forecast.DateTime
		};
	});
}

function handleMetricUnit(data: any) {
	if (data.Metric) {
		return data.Metric.Unit;
	}

	return data.Unit;
}

function handleMetricValue(data: any) {
	if (data.Metric) {
		return data.Metric.Value;
	}

	return data.Value;
}

function handleWeather(rawCurrentWeather: string) {
	const [currentWeather] = JSON.parse(rawCurrentWeather);
	return formatWeather(currentWeather);
}

type foo = Record<string, any>;

function formatWeather(weather: foo) {
	return {
		weatherIcon: String(weather.WeatherIcon).padStart(2, '0'),
		weatherText: weather.WeatherText || '-',
		windDirection: weather.Wind.Direction.English,
		windGust: handleMetricValue(weather.WindGust.Speed) + handleMetricUnit(weather.WindGust.Speed),
		windSpeed: handleMetricValue(weather.Wind.Speed) + handleMetricUnit(weather.Wind.Speed),
		temperature: Math.round(handleMetricValue(weather.Temperature)),
		realFeelTemperature: Math.round(handleMetricValue(weather.RealFeelTemperature)),
		hasRain: weather.HasPrecipitation
	};
}

async function getWeatherForLocation(locationID: string) {
	const result = await knex
		.select('*')
		.from('weather')
		.where('locationID', locationID)
		.first();

	if (result) {
		return {
			updatedAt: result.updatedAt,
			current: handleWeather(result.current),
			forecast: formatForecasts(result.forecast)
		};
	}
}

async function insertOrUpdateWeather({
	locationID,
	weather: rawWeather,
	forecast: rawForecast
}: {
	locationID: string;
	weather: Record<string, unknown>;
	forecast: Record<string, unknown>;
}) {
	const weather = JSON.stringify(rawWeather);
	const forecast = JSON.stringify(rawForecast);

	const currentWeather = await getWeatherForLocation(locationID);

	await (currentWeather ? knex('weather')
		.where({
			locationID
		}).update({
			current: weather,
			forecast,
			updatedAt: knex.raw('CURRENT_TIMESTAMP')
		}) : knex('weather')
		.insert({
			locationID,
			current: weather,
			forecast
		}));

	return getWeatherForLocation(locationID);
}

export default {
	getWeatherForLocation,
	insertOrUpdateWeather
};
