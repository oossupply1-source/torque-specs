async function searchVin(){
  const vin = vinInput.value.trim().toUpperCase();
  if(vin.length !== 17) return alert("Invalid VIN");

  const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
  const data = await res.json();

  const get = key => data.Results.find(r => r.Variable === key)?.Value;

  const make = get("Make")?.toLowerCase();
  const model = get("Model");
  const year = get("Model Year");
  const engine = get("Engine Model");

  if(!make) return alert("VIN not supported");

  loadBrand(make, model, year, engine);
}
