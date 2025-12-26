async function searchVin(){
  const vin = document.getElementById("vinInput").value.trim().toUpperCase();
  if(vin.length !== 17) return alert("VIN must be 17 characters");

  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
  );
  const data = await res.json();

  const get = k => data.Results.find(r=>r.Variable===k)?.Value;
  const make = get("Make")?.toLowerCase();
  const model = get("Model");

  if(!make) return alert("VIN not supported");

  loadBrand(make, model);
}
