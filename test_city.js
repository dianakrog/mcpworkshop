#!/usr/bin/env node
/**
 * City Weather Test Helper
 * Simplifies running the generic weather test for different cities
 * 
 * Usage: node test_city.js <city> <country> [expected_temp] [geojson_file]
 * Example: node test_city.js Lima Peru 18.5 lima_weather_polygon.geojson
 */

const { spawn } = require('child_process');
const path = require('path');

// City configurations with defaults
const CITY_CONFIGS = {
  'madrid': {
    name: 'Madrid',
    country: 'Spain',
    expectedTemp: '23.9',
    geoJsonFile: 'madrid_weather_polygon.geojson',
    nearbyCities: 'Toledo; Spain,Segovia; Spain,Guadalajara; Spain',
    overlayColor: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    cityIcon: '🏛️'
  },
  'lima': {
    name: 'Lima',
    country: 'Peru',
    expectedTemp: '18.5',
    geoJsonFile: 'lima_weather_polygon.geojson',
    nearbyCities: 'Callao; Peru,Huancayo; Peru,Ica; Peru',
    overlayColor: 'linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%)',
    cityIcon: '🏔️'
  },
  'tokyo': {
    name: 'Tokyo',
    country: 'Japan',
    expectedTemp: '22.0',
    geoJsonFile: 'tokyo_weather_polygon.geojson',
    nearbyCities: 'Yokohama; Japan,Kawasaki; Japan,Saitama; Japan',
    overlayColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    cityIcon: '🌸'
  },
  'london': {
    name: 'London',
    country: 'UK',
    expectedTemp: '12.5',
    geoJsonFile: 'london_weather_polygon.geojson',
    nearbyCities: 'Oxford; UK,Cambridge; UK,Brighton; UK',
    overlayColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cityIcon: '🏰'
  },
  'paris': {
    name: 'Paris',
    country: 'France',
    expectedTemp: '15.0',
    geoJsonFile: 'paris_weather_polygon.geojson',
    nearbyCities: 'Versailles; France,Meaux; France,Pontoise; France',
    overlayColor: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    cityIcon: '🗼'
  },
  'new-york': {
    name: 'New York',
    country: 'USA',
    expectedTemp: '20.0',
    geoJsonFile: 'newyork_weather_polygon.geojson',
    nearbyCities: 'Newark; USA,Jersey City; USA,Yonkers; USA',
    overlayColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    cityIcon: '🗽'
  },
  'luanda': {
    name: 'Luanda',
    country: 'Angola',
    expectedTemp: '26.8',
    geoJsonFile: 'luanda_weather_polygon.geojson',
    nearbyCities: 'Benguela; Angola,Huambo; Angola,Lobito; Angola',
    overlayColor: 'linear-gradient(135deg, #ff9500 0%, #ff5500 100%)',
    cityIcon: '🏛️'
  }
};

function showUsage() {
  console.log('\n🌡️ City Weather Test Helper\n');
  console.log('Usage:');
  console.log('  node test_city.js <city> <country> [expected_temp] [geojson_file]');
  console.log('  node test_city.js <preset>');
  console.log('\nExamples:');
  console.log('  node test_city.js Lima Peru 18.5 lima_weather_polygon.geojson');
  console.log('  node test_city.js lima');
  console.log('  node test_city.js madrid');
  console.log('\nAvailable presets:');
  Object.keys(CITY_CONFIGS).forEach(key => {
    const config = CITY_CONFIGS[key];
    console.log(`  ${key} -> ${config.name}, ${config.country} (${config.expectedTemp}°C) ${config.cityIcon}`);
  });
  console.log('\n');
}

function runTest(config) {
  console.log(`\n🌡️ Starting weather test for ${config.name}, ${config.country}\n`);
  
  // Set environment variables
  const env = {
    ...process.env,
    TEST_CITY: config.name,
    TEST_COUNTRY: config.country,
    EXPECTED_TEMP: config.expectedTemp,
    GEOJSON_FILE: config.geoJsonFile,
    NEARBY_CITIES: config.nearbyCities,
    OVERLAY_COLOR: config.overlayColor,
    CITY_ICON: config.cityIcon
  };

  // Determine the correct npm command based on platform
  const isWindows = process.platform === 'win32';
  const npmCommand = isWindows ? 'npm.cmd' : 'npm';

  // Spawn npm test with environment variables
  const testProcess = spawn(npmCommand, ['test'], {
    env: env,
    stdio: 'inherit',
    cwd: __dirname,
    shell: true  // Important for Windows compatibility
  });

  testProcess.on('error', (error) => {
    console.error(`❌ Error starting test: ${error.message}`);
    process.exit(1);
  });

  testProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`\n✅ ${config.name} weather test completed successfully!`);
    } else {
      console.log(`\n❌ ${config.name} weather test failed with code ${code}`);
    }
    process.exit(code);
  });
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  showUsage();
  process.exit(1);
}

// Check if it's a preset
const preset = args[0].toLowerCase();
if (CITY_CONFIGS[preset]) {
  runTest(CITY_CONFIGS[preset]);
} else if (args.length >= 2) {
  // Custom city configuration
  const config = {
    name: args[0],
    country: args[1],
    expectedTemp: args[2] || '20.0',
    geoJsonFile: args[3] || `${args[0].toLowerCase()}_weather_polygon.geojson`,
    nearbyCities: `${args[0]}, ${args[1]}`, // Default nearby cities (same as main)
    overlayColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    cityIcon: '🌍'
  };
  
  console.log(`📝 Using custom configuration for ${config.name}, ${config.country}`);
  console.log(`   Expected temp: ${config.expectedTemp}°C`);
  console.log(`   GeoJSON file: ${config.geoJsonFile}`);
  console.log(`   Note: Update nearby cities in your weather script for better results\n`);
  
  runTest(config);
} else {
  console.error('❌ Invalid arguments. Please provide city and country, or use a preset.');
  showUsage();
  process.exit(1);
}
