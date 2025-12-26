let unit = "ft";
let brandData = {};

async function loadBrand(make, model, year, engine){
  const res = await fetch(`data/${make}.json`);
  brandData = await res.json();

  vehicleSelect.innerHTML = "";
  for(const key in brandData){
    const v = brandData[key];
    if(v.models.includes(model)){
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = `${v.models[0]} (${v.years})`;
      vehicleSelect.appendChild(opt);
    }
  }
  loadSpecs();
}

function loadSpecs(){
  const v = brandData[vehicleSelect.value];
  results.innerHTML = "";

  render("Powertrain", {
    Engine: v.powertrain.engine_name,
    Transmission: v.powertrain.transmission_name,
    Differential: v.powertrain.differential_name
  });

  render("Engine", v.engine);
  render("Transmission", v.transmission);
  render("Differential", v.differential);
}

function render(title, obj){
  if(!obj) return;
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h3>${title}</h3>`;
  for(const k in obj){
    const v = typeof obj[k] === "number" ? convert(obj[k]) : obj[k];
    card.innerHTML += `<div class="spec"><span>${k}</span><span>${v}</span></div>`;
  }
  results.appendChild(card);
}

function toggleUnits(){
  unit = unit === "ft" ? "nm" : "ft";
  unitBtn.textContent = unit === "ft" ? "Units: ft-lb" : "Units: Nm";
  loadSpecs();
}

function convert(v){
  return unit === "ft" ? `${v} ft-lb` : `${Math.round(v*1.356)} Nm`;
}
