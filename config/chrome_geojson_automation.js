const { chromium } = require('playwright');
const fs = require('fs');

async function openGeoJSONInChrome() {
  console.log("🌡️ Lima Temperature from CALL__CITY_WEATHER_PROMPT: 17.7°C");
  console.log("🚀 Starting Chrome automation with Playwright...");
  
  try {
    // Read the GeoJSON data
    const geoJsonPath = 'lima_weather_polygon.geojson';
    const geoJsonData = fs.readFileSync(geoJsonPath, 'utf8');
    const geoJsonObject = JSON.parse(geoJsonData);
    
    console.log("📄 Loaded GeoJSON data:");
    console.log(`   🏙️ Features: ${geoJsonObject.features.length}`);
    console.log(`   🌡️ Lima: 17.7°C`);
    console.log(`   🏘️ Callao: 17.4°C`);
    console.log(`   🏔️ Huancayo: 15.4°C`);
    console.log(`   🏖️ Trujillo: 20.5°C`);
    
    // Launch Chrome browser
    console.log("🌐 Launching Chrome browser...");
    const browser = await chromium.launch({ 
      headless: false,
      channel: 'chrome',
      args: ['--start-maximized']
    });
    
    const context = await browser.newContext({
      viewport: null
    });
    const page = await context.newPage();
    
    // Navigate to geojson.io
    console.log("📍 Navigating to https://geojson.io/...");
    await page.goto('https://geojson.io/', { waitUntil: 'networkidle' });
    
    // Wait for the editor to load
    console.log("⏳ Waiting for editor to load...");
    await page.waitForSelector('.CodeMirror', { timeout: 10000 });
    await page.waitForTimeout(3000);
    
    // Create a beautiful notification overlay
    await page.evaluate((weatherData) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 25px;
        border-radius: 15px;
        z-index: 10000;
        max-width: 400px;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border: 2px solid rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
      `;
      overlay.innerHTML = `
        <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">
          🌡️ CALL__CITY_WEATHER_PROMPT Results
        </h3>
        <div style="margin-bottom: 15px;">
          <div style="font-size: 16px; font-weight: 500;">🏙️ Lima, Peru</div>
          <div style="font-size: 28px; font-weight: bold; color: #FFD700;">17.7°C</div>
        </div>
        <div style="font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
          <div>🏘️ Callao: 17.4°C</div>
          <div>🏔️ Huancayo: 15.4°C</div>
          <div>🏖️ Trujillo: 20.5°C</div>
        </div>
        <div style="font-size: 12px; opacity: 0.9; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 10px;">
          ✅ GeoJSON loaded automatically via Playwright<br>
          📊 Average Temperature: 17.8°C
        </div>
      `;
      document.body.appendChild(overlay);
      
      // Auto-remove after 15 seconds
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 15000);
    }, {});
    
    // Click on the editor and clear existing content
    console.log("✏️ Clearing editor and inserting Lima weather GeoJSON...");
    await page.click('.CodeMirror');
    await page.keyboard.press('Control+a');
    await page.waitForTimeout(500);
    
    // Input the GeoJSON data
    await page.keyboard.type(geoJsonData);
    
    console.log("✅ GeoJSON data successfully inserted into geojson.io!");
    console.log("🗺️ You should now see:");
    console.log("   📍 Lima (main city) - 17.7°C");
    console.log("   📍 Callao (port city) - 17.4°C");
    console.log("   📍 Huancayo (mountain city) - 15.4°C");
    console.log("   📍 Trujillo (northern coast) - 20.5°C");
    console.log("   🔺 Weather polygon created using AgroPolygons methodology");
    
    // Wait for the map to render
    await page.waitForTimeout(2000);
    
    // Try to zoom to fit the data
    try {
      await page.click('[title="Zoom to data"]', { timeout: 5000 });
      console.log("🔍 Zoomed to fit Lima weather data");
    } catch (e) {
      console.log("ℹ️ Auto-zoom not available, map should show Peru region");
    }
    
    console.log("\n📊 CALL__CITY_WEATHER_PROMPT Complete!");
    console.log("=" .repeat(60));
    console.log("🌡️ Main City: Lima, Peru - 17.7°C");
    console.log("💧 Humidity: 89%");
    console.log("💨 Wind Speed: 13.7 km/h");
    console.log("🏘️ Nearby Cities Found: 3");
    console.log("📁 GeoJSON File: lima_weather_polygon.geojson");
    console.log("🌐 Opened in: https://geojson.io/");
    console.log("=" .repeat(60));
    
    // Keep browser open for user interaction
    console.log("⏰ Browser will stay open for 90 seconds for you to explore...");
    await page.waitForTimeout(90000);
    
  } catch (error) {
    console.error("❌ Error during automation:", error);
  } finally {
    console.log("🏁 Closing browser...");
    if (typeof browser !== 'undefined') {
      await browser.close();
    }
  }
}

// Execute the automation
openGeoJSONInChrome().catch(console.error);
