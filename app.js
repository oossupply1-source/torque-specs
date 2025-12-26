let unit = "ft";
let brandData = {};

// Load brand JSON and populate vehicle select
async function loadBrand(make, model, year, engine){
  try {
    const res = await fetch(`data/${make}.json`);
    if(!res.ok) throw new Error(`Brand file ${make}.json not found`);
    brandData = await res.json();

    const vehicleSelect = document.getElementById("vehicleSelect");
    vehicleSelect.innerHTML = `<option value="">Select Vehicle</option>`;

    const normalize = str => str.toLowerCase().replace(/\s|-/g, "");

    for(const key in brandData){
      const v = brandData[key];
      if(v.models.some(m => normalize(m) === normalize(model))){
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = `${v.models[0]} (${v.years})`;
        vehicleSelect.appendChild(opt);
      }
    }

    if(vehicleSelect.options.length === 1){
      alert("Vehicle decoded, but no matching model found in JSON data");
    } else {
      vehicleSelect.selectedIndex = 1;
      loadSpecs();
    }

  } catch(err){
    console.error(err);
    alert("Error loading brand data: " + err.message);
  }
}

// Load torque specs and render
function loadSpecs(){
  const vehicleSelect = document.getElementById("vehicleSelect");
  const key = vehicleSelect.value;
  if(!key || !brandData[key]) return;

  const v = brandData[key];
  const results = document.getElementById("results");
  results.innerHTML = "";

  render("Powertrain", {
    "Engine": v.powertrain.engine_name,
    "Transmission": v.powertrain.transmission_name,
    "Differential": v.powertrain.differential_name
  });

  render("Engine Torque Specs", v.engine);
  render("Transmission Torque Specs", v.transmission);
  render("Differential Torque Specs", v.differential);
}

// Helper to render a section
function render(title, obj){
  if(!obj) return;
  const results = document.getElementById("results");
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h3>${title}</h3>`;
  for(const k in obj){
    const val = typeof obj[k] === "number" ? convert(obj[k]) : obj[k];
    card.innerHTML += `<div class="spec"><span>${k}</span><span>${val}</span></div>`;
  }
  results.appendChild(card);
}

// Toggle units
function toggleUnits(){
  unit = unit === "ft" ? "nm" : "ft";
  document.getElementById("unitBtn").textContent =
    unit === "ft" ? "Units: ft-lb" : "Units: Nm";
  loadSpecs();
}

// Convert torque units
function convert(v){
  return unit === "ft" ? `${v} ft-lb` : `${Math.round(v*1.356)} Nm`;
}
