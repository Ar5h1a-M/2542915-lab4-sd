

document.getElementById("submitButton").addEventListener("click", () => {
  const countryName = document.getElementById("countryName").value;
  getCountryInfo(countryName);
});

async function getCountryInfo(countryName) {
  const info = document.getElementById("country-info");
  const borders = document.getElementById("bordering-countries");

  info.innerHTML = "";
  borders.innerHTML = "";

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
    if (!res.ok) throw new Error(" Cannot find country.");

    const [country] = await res.json();
    showCountry(country);
    showBorders(country.borders);

  } catch (err) {
    info.innerHTML = `<p>${err.message}</p>`;
  }
}

function showCountry(country) {
  const info = document.getElementById("country-info");
  const cap = country.capital ? country.capital[0] : "Unsure";
  const pop = country.population.toLocaleString();

  info.innerHTML = `
    <h2>${country.name.common}</h2>
    <img src="${country.flags.png}" alt="${country.name.common} flag" width="100">
    <p>Capital: ${cap}</p>
    <p>Population: ${pop}</p>
    <p>Region: ${country.region}</p>
  `;
}

async function showBorders(borderCodes) {
  const borders = document.getElementById("bordering-countries");

  if (!borderCodes || borderCodes.length === 0) {
    borders.innerHTML = "<p>No borders.</p>";
    return;
  }

  try {
    const countries = await Promise.all(
      borderCodes.map(async (code) => {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        if (!res.ok) throw new Error("Border fetch fail.");
        return res.json();
      })
    );

    let borderHTML = ""; 

    countries.forEach(([country]) => {
      borderHTML += `<img src="${country.flags.png}" alt="${country.name.common} flag"> 
      <p>${country.name.common} </p>`;
    });

    borders.innerHTML = borderHTML; 

  } catch (err) {
    borders.innerHTML = `<p>Border fetch error.</p>`;
  }
}
