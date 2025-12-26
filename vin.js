async function searchVin() {
  const vinInput = document.getElementById("vinInput");
  const vin = vinInput.value.trim().toUpperCase();

  if (vin.length !== 17) {
    alert("VIN must be 17 characters");
    return;
  }

  try {
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
    if (!res.ok) throw new Error("Failed to fetch VIN data");
    const data = await res.json();

    // Helper to get variable value
    const getVar = name => data.Results.find(r => r.Variable === name)?.Value;

    const make = getVar("Make")?.trim().toLowerCase();
    const model = getVar("Model")?.trim();
    const yearStr = getVar("Model Year")?.trim();
    const engine = getVar("Engine Model")?.trim();

    if (!make || !model || !yearStr) {
      alert("VIN decoded but missing data");
      return;
    }

    const year = parseInt(yearStr);

    // Call app.js function to load brand JSON and render
    loadBrand(make, model, year, engine);

  } catch (err) {
    console.error(err);
    alert("Error decoding VIN: " + err.message);
  }
}
