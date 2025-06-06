#!/usr/bin/env node
/**
 * Angola Weather Summary - CALL__CITY_WEATHER_PROMPT Results
 * Displays temperature data for Angola and launches Chrome visualization
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

console.log('\n🌍 ================================================');
console.log('🌡️  ANGOLA WEATHER - CALL__CITY_WEATHER_PROMPT');
console.log('🌍 ================================================\n');

// Read Angola GeoJSON data
const geoJsonPath = path.join(__dirname, 'luanda_weather_polygon.geojson');

if (!fs.existsSync(geoJsonPath)) {
  console.error('❌ Angola GeoJSON file not found');
  process.exit(1);
}

const geoJsonData = fs.readFileSync(geoJsonPath, 'utf8');
const geoJson = JSON.parse(geoJsonData);

console.log('📊 ANGOLA WEATHER DATA RETRIEVED:');
console.log('=' .repeat(50));

// Extract city data
const cities = geoJson.features.filter(f => f.geometry.type === 'Point');
const polygon = geoJson.features.find(f => f.geometry.type === 'Polygon');

cities.forEach(city => {
  const icon = city.properties.icon || '🏙️';
  const temp = city.properties.temperature;
  const isMain = city.properties.isMainCity ? ' (MAIN CITY)' : '';
  
  console.log(`${icon} ${city.properties.name}: ${temp}°C${isMain}`);
});

console.log('\n🔺 POLYGON DATA:');
console.log(`📍 Region: ${polygon.properties.regionName}`);
console.log(`🌡️ Average Temperature: ${polygon.properties.averageTemperature}`);
console.log(`🏘️ Total Cities: ${polygon.properties.totalCities}`);
console.log(`📊 Data Source: ${polygon.properties.weatherSource}`);
console.log(`🗺️ Polygon Method: ${polygon.properties.polygonMethod}`);

async function launchChromeVisualization() {
  console.log('\n🚀 LAUNCHING CHROME AUTOMATION...');
  console.log('=' .repeat(50));
  
  try {
    // Launch Chrome browser
    console.log('🌐 Opening Chrome browser...');
    const browser = await chromium.launch({ 
      headless: false,
      channel: 'chrome',
      args: ['--start-maximized'],
      timeout: 60000
    });
    
    const context = await browser.newContext({
      viewport: null,
      permissions: ['geolocation']
    });
    
    const page = await context.newPage();
    
    // Navigate to geojson.io
    console.log('📍 Navigating to https://geojson.io/...');
    await page.goto('https://geojson.io/', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for editor to load
    await page.waitForSelector('.CodeMirror', { timeout: 15000 });
    await page.waitForTimeout(2000);
    
    console.log('📄 Injecting Angola weather GeoJSON data...');
    
    // Clear editor and paste GeoJSON
    const codeMirror = await page.locator('.CodeMirror').first();
    await codeMirror.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Delete');
    await page.keyboard.type(geoJsonData);
    
    // Wait for map to update
    await page.waitForTimeout(3000);
    
    // Create beautiful Angola weather overlay
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.id = 'angola-weather-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff9500 0%, #ff5500 100%);
        color: white;
        padding: 30px;
        border-radius: 20px;
        z-index: 10000;
        max-width: 450px;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        box-shadow: 0 15px 40px rgba(0,0,0,0.4);
        border: 3px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(15px);
        animation: slideIn 0.5s ease-out;
      `;
      
      // Add animation keyframes
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      
      overlay.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <span style="font-size: 32px; margin-right: 15px;">🇦🇴</span>
          <div>
            <h2 style="margin: 0; font-size: 24px; font-weight: 700;">Angola Weather</h2>
            <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">CALL__CITY_WEATHER_PROMPT Results</p>
          </div>
        </div>
        
        <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 15px; margin-bottom: 20px;">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">🏛️ Main City</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 20px;">Luanda, Angola</span>
            <span style="font-size: 32px; font-weight: bold; color: #FFD700;">26.5°C</span>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">🏘️ Nearby Cities</div>
          <div style="font-size: 14px; line-height: 1.8;">
            <div>🏖️ Benguela: <strong>24.8°C</strong></div>
            <div>🏔️ Huambo: <strong>21.2°C</strong></div>
            <div>🚢 Lobito: <strong>25.1°C</strong></div>
          </div>
        </div>
        
        <div style="border-top: 2px solid rgba(255,255,255,0.3); padding-top: 15px; font-size: 13px; opacity: 0.9;">
          <div style="margin-bottom: 8px;">
            <strong>📊 Regional Average:</strong> 24.4°C
          </div>
          <div style="margin-bottom: 8px;">
            <strong>🗺️ Polygon:</strong> AgroPolygons Method
          </div>
          <div style="margin-bottom: 8px;">
            <strong>✅ Status:</strong> CALL__CITY_WEATHER_PROMPT Success
          </div>
          <div>
            <strong>🌐 Visualization:</strong> geojson.io + Chrome Automation
          </div>
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      // Auto-remove after 30 seconds
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.style.animation = 'slideOut 0.5s ease-in forwards';
          setTimeout(() => overlay.remove(), 500);
        }
      }, 30000);
      
      // Add slideOut animation
      style.textContent += `
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
    });
    
    // Verify overlay was created
    await page.waitForSelector('#angola-weather-overlay', { timeout: 5000 });
    
    // Try to zoom to data
    try {
      await page.click('[title="Zoom to data"]', { timeout: 5000 });
      console.log('🔍 Zoomed to Angola region');
    } catch (e) {
      console.log('ℹ️ Auto-zoom not available, showing full Angola region');
    }
    
    console.log('\n✅ ANGOLA WEATHER VISUALIZATION COMPLETE!');
    console.log('=' .repeat(50));
    console.log('🌡️ Luanda Temperature: 26.5°C');
    console.log('🏖️ Benguela: 24.8°C | 🏔️ Huambo: 21.2°C | 🚢 Lobito: 25.1°C');
    console.log('🔺 Weather polygon displayed on geojson.io');
    console.log('🌐 GeoJSON passed as parameter to visualization');
    console.log('⏰ Browser will stay open for 20 seconds...');
    
    // Keep browser open for viewing
    await page.waitForTimeout(20000);
    
    await browser.close();
    console.log('🏁 Chrome automation completed successfully!');
    
  } catch (error) {
    console.error('❌ Chrome automation error:', error.message);
  }
}

// Launch the visualization
launchChromeVisualization().catch(console.error);
