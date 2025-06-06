# Generic City Weather Test Documentation

## Overview

The `madrid_weather.test.js` has been converted into a **generic city weather test suite** that can test the CALL__CITY_WEATHER_PROMPT methodology for any city in the world.

## Configuration Options

The test suite uses environment variables for configuration, making it easy to test different cities without modifying code:

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `TEST_CITY` | Target city name | `Madrid` | `Lima`, `Tokyo`, `London` |
| `TEST_COUNTRY` | Country name | `Spain` | `Peru`, `Japan`, `UK` |
| `EXPECTED_TEMP` | Expected temperature (°C) | `23.9` | `18.5`, `12.0`, `25.8` |
| `GEOJSON_FILE` | GeoJSON filename | `madrid_weather_polygon.geojson` | `lima_weather_polygon.geojson` |
| `NEARBY_CITIES` | Comma-separated nearby cities | `Toledo, Spain,Segovia, Spain,Guadalajara, Spain` | `Callao, Peru,Huancayo, Peru,Ica, Peru` |
| `OVERLAY_COLOR` | CSS gradient for overlay | `linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)` | `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)` |
| `CITY_ICON` | Emoji for city display | `🏛️` | `🏔️`, `🌸`, `🏰` |

## Usage Examples

### Test Lima, Peru

```bash
# Set environment variables
set TEST_CITY=Lima
set TEST_COUNTRY=Peru
set EXPECTED_TEMP=18.5
set GEOJSON_FILE=lima_weather_polygon.geojson
set NEARBY_CITIES=Callao, Peru,Huancayo, Peru,Ica, Peru
set OVERLAY_COLOR=linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%)
set CITY_ICON=🏔️

# Run the test
npm test
```

### Test Tokyo, Japan

```bash
# Windows
set TEST_CITY=Tokyo
set TEST_COUNTRY=Japan
set EXPECTED_TEMP=22.0
set GEOJSON_FILE=tokyo_weather_polygon.geojson
set NEARBY_CITIES=Yokohama, Japan,Kawasaki, Japan,Saitama, Japan
set OVERLAY_COLOR=linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)
set CITY_ICON=🌸

npm test

# Linux/Mac
export TEST_CITY=Tokyo
export TEST_COUNTRY=Japan
export EXPECTED_TEMP=22.0
export GEOJSON_FILE=tokyo_weather_polygon.geojson
export NEARBY_CITIES="Yokohama, Japan,Kawasaki, Japan,Saitama, Japan"
export OVERLAY_COLOR="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
export CITY_ICON=🌸

npm test
```

### Test London, UK

```bash
set TEST_CITY=London
set TEST_COUNTRY=UK
set EXPECTED_TEMP=12.5
set GEOJSON_FILE=london_weather_polygon.geojson
set NEARBY_CITIES=Oxford, UK,Cambridge, UK,Brighton, UK
set OVERLAY_COLOR=linear-gradient(135deg, #667eea 0%, #764ba2 100%)
set CITY_ICON=🏰

npm test
```

## Step-by-Step Process

1. **Prepare Weather Data**: First run your city-specific weather script to generate the GeoJSON file
   ```javascript
   // Example for Lima
   const lima_weather = require('./lima_weather.js');
   // This should generate lima_weather_polygon.geojson
   ```

2. **Configure Test Environment**: Set the environment variables for your target city

3. **Run Generic Test**: Execute the test suite
   ```bash
   npm test
   ```

## Test Suite Features

The generic test performs these validations for any city:

1. **GeoJSON File Validation**
   - Verifies file exists and has correct structure
   - Validates main city temperature matches expected value
   - Confirms all nearby cities are included

2. **Polygon Feature Validation**
   - Ensures polygon encompasses all cities
   - Validates average temperature calculation
   - Checks coordinate structure

3. **Chrome Browser Automation**
   - Opens geojson.io in Chrome
   - Injects city-specific GeoJSON data
   - Creates dynamic overlay with city information
   - Displays for 15 seconds for visual confirmation

4. **Temperature Range Validation**
   - Ensures all temperatures are within realistic ranges (-10°C to 50°C)
   - Validates data consistency across nearby cities

5. **Methodology Completion Check**
   - Confirms all CALL__CITY_WEATHER_PROMPT steps completed
   - Validates AgroPolygons polygon generation
   - Ensures Chrome automation pipeline works

## Creating City-Specific Test Scripts

You can create convenience scripts for common cities by adding them to `package.json`:

```json
{
  "scripts": {
    "test:lima": "cross-env TEST_CITY=Lima TEST_COUNTRY=Peru EXPECTED_TEMP=18.5 GEOJSON_FILE=lima_weather_polygon.geojson NEARBY_CITIES=\"Callao, Peru,Huancayo, Peru,Ica, Peru\" OVERLAY_COLOR=\"linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%)\" CITY_ICON=🏔️ npm test",
    "test:tokyo": "cross-env TEST_CITY=Tokyo TEST_COUNTRY=Japan EXPECTED_TEMP=22.0 GEOJSON_FILE=tokyo_weather_polygon.geojson NEARBY_CITIES=\"Yokohama, Japan,Kawasaki, Japan,Saitama, Japan\" OVERLAY_COLOR=\"linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)\" CITY_ICON=🌸 npm test",
    "test:london": "cross-env TEST_CITY=London TEST_COUNTRY=UK EXPECTED_TEMP=12.5 GEOJSON_FILE=london_weather_polygon.geojson NEARBY_CITIES=\"Oxford, UK,Cambridge, UK,Brighton, UK\" OVERLAY_COLOR=\"linear-gradient(135deg, #667eea 0%, #764ba2 100%)\" CITY_ICON=🏰 npm test"
  }
}
```

Then run with:
```bash
npm run test:lima
npm run test:tokyo
npm run test:london
```

## Expected Output

When running the generic test, you'll see output like:

```
✅ [City] weather data validated: [Temperature]°C
✅ [Nearby City 1]: [Temperature]°C
✅ [Nearby City 2]: [Temperature]°C
✅ [City] weather polygon validated with average temp: [Average]°C
🌐 Opening geojson.io in Chrome for [City]...
📄 Injecting [City] weather GeoJSON data...
✅ [City] GeoJSON successfully loaded and displayed in Chrome
🗺️ [City] weather data visualized at geojson.io
🌡️ Showing [City] ([Temperature]°C) and [N] nearby cities
✅ [City] temperature retrieved: COMPLETED
✅ Nearby cities found: COMPLETED
✅ [City] GeoJSON created: COMPLETED
✅ Chrome automation working: COMPLETED
✅ geojson.io visualization: COMPLETED

🎉 CALL__CITY_WEATHER_PROMPT methodology fully implemented for [City]!
```

## Troubleshooting

1. **Missing GeoJSON File**: Ensure you've run the weather data collection script for your city first
2. **Temperature Mismatch**: Update `EXPECTED_TEMP` to match the actual temperature from your weather script
3. **Chrome Issues**: Make sure Chrome is installed and Playwright can access it
4. **Environment Variables**: On Windows use `set`, on Linux/Mac use `export`

## Benefits of Generic Approach

- ✅ **Reusable**: Test any city without code changes
- ✅ **Configurable**: Customize appearance and validation for each city
- ✅ **Maintainable**: Single test file handles all cities
- ✅ **Consistent**: Same validation logic across all cities
- ✅ **Visual**: Dynamic overlays show city-specific information
- ✅ **Automated**: Full browser automation with geojson.io integration
