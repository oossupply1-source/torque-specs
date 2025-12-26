// VIN.js - Direct VIN decoding using vinMapping.json

async function searchVin() {
  const vin = document.getElementById("vinInput").value.trim().toUpperCase();
  if (vin.length !== 17) return alert("VIN must be 17 characters");

  try {
    const res = await fetch("vinMapping.json");
    const vinMapping = await res.json();

    const wmi = vin.slice(0, 3); // first 3 chars
    const yearChar = vin[9]; // 10th char
    const year = decodeVinYear(yearChar);

    if (!vinMapping[wmi]) return alert("VIN WMI not found");

    const models = vinMapping[wmi];
    let found = false;

    for (const modelName in models) {
      const ranges = models[modelName];

      for (const range in ranges) {
        const [start, end] = range.split("-").map(Number);
        if (year >= start && year <= end) {
          const engines = ranges[range];
          const engineCode = Object.keys(engines)[0];
          const jsonKey = engines[engineCode];

          // Set vehicle select
          const vehicleSelect = document.getElementById("vehicleSelect");
          vehicleSelect.value = jsonKey;
          loadBrandFromKey(jsonKey);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) alert("VIN decoded, but model not found in data files");

  } catch (err) {
    alert("Error loading VIN mapping: " + err.message);
    console.error(err);
  }
}

// Decode 10th VIN character to year
function decodeVinYear(c) {
  const map = {
    A: 1980, B: 1981, C: 1982, D: 1983, E: 1984, F: 1985,
    G: 1986, H: 1987, J: 1988, K: 1989, L: 1990, M: 1991,
    N: 1992, P: 1993, R: 1994, S: 1995, T: 1996, V: 1997,
    W: 1998, X: 1999, Y: 2000,
    1: 2001, 2: 2002, 3: 2003, 4: 2004, 5: 2005, 6: 2006,
    7: 2007, 8: 2008, 9: 2009
  };
  // Extend for 2010+
  if (c >= 'A' && c <= 'Y') {
    const decade = 2010 + (c.charCodeAt(0) - 'A'.charCodeAt(0));
    if (decade <= 2030) return decade;
  }
  return map[c] || null;
}

// Load vehicle JSON directly using key
async function loadBrandFromKey(key) {
  try {
    const res = await fetch(`data/${key}.json`);
    if (!res.ok) throw new Error("Vehicle JSON not found");

    const brandData = await res.json();
    window.brandData = brandData; // global for app.js
    const vehicleSelect = document.getElementById("vehicleSelect");
    vehicleSelect.value = key;
    loadSpecs();

  } catch (err) {
    alert("Error loading vehicle data: " + err.message);
    console.error(err);
  }
}
