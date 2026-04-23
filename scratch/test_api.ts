async function testAPI() {
  try {
    const res = await fetch('http://localhost:5000/api/planning/generate-strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop: 'Wheat', soil: 'Loamy', landSize: 5, season: 'Winter' })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Items returned:", data.length);
    if (data.length > 0) {
      console.log("First Month Activity:", data[0].activity);
    }
  } catch (e) {
    console.error("API Test Failed:", e.message);
  }
}
testAPI();
