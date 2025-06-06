import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import https from "https";

const server = new McpServer({
  name: "GeoCoder",
  version: "1.0.0"
});

async function makeHttpRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = "";
      res.on("data", chunk => body += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
}

server.resource(
  "geocode",
  new ResourceTemplate("geocode://{city}", { list: undefined }),
  async (uri, { city }) => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
    const data = await makeHttpRequest(url);
    const results = JSON.stringify(data, null, 2);

    return {
      contents: [{
        uri: uri.href,
        text: `Geocoding results for "${city}":\n\n${results}`
      }]
    };
  }
);

server.resource(
  "weather",
  new ResourceTemplate("weather://{city}", { list: undefined }),
  async (uri, { city }) => {
    try {
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
      const geocodeData = await makeHttpRequest(geocodeUrl);
      
      if (!geocodeData.results || geocodeData.results.length === 0) {
        return {
          contents: [{
            uri: uri.href,
            text: `City "${city}" not found.`
          }]
        };
      }

      const location = geocodeData.results[0];
      const { latitude, longitude, name, country } = location;

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;
      const weatherData = await makeHttpRequest(weatherUrl);

      const current = weatherData.current;
      
      const weatherInfo = {
        city: `${name}, ${country}`,
        coordinates: { latitude, longitude },
        temperature: `${current.temperature_2m}°C`,
        relativeHumidity: `${current.relative_humidity_2m}%`,
        precipitation: `${current.precipitation} mm`,
        windSpeed: `${current.wind_speed_10m} km/h`,
        time: current.time
      };

      return {
        contents: [{
          uri: uri.href,
          text: `Weather information for ${weatherInfo.city}:

🌡️  Temperature: ${weatherInfo.temperature}
💧 Relative Humidity: ${weatherInfo.relativeHumidity}
🌧️  Precipitation: ${weatherInfo.precipitation}
💨 Wind Speed: ${weatherInfo.windSpeed}
📍 Coordinates: ${weatherInfo.coordinates.latitude}, ${weatherInfo.coordinates.longitude}
🕒 Last Updated: ${weatherInfo.time}

Raw data:
${JSON.stringify(weatherData, null, 2)}`
        }]
      };
    } catch (error) {
      return {
        contents: [{
          uri: uri.href,
          text: `Error getting weather for "${city}": ${error.message}`
        }]
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
