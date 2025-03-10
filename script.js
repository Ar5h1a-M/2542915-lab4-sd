
document.getElementById("submitButton").addEventListener("click", function() {
    const countryName = document.getElementById("countryName").value;
    fetchCountryData(countryName);
});

async function fetchCountryData(countryName) {
    const countryInfoSection = document.getElementById("country-info");
    const borderingCountriesSection = document.getElementById("bordering-countries");

    countryInfoSection.innerHTML = ""; 
    borderingCountriesSection.innerHTML = "";  data

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            throw new Error("Country not found.");
        }

        const country = data[0]; 
        displayCountryInfo(country);
        displayBorderingCountries(country.borders);

    } catch (error) {
        countryInfoSection.innerHTML = `<p class="error-message">Error fetching countries.</p>`;
    }
}

function displayCountryInfo(country) {
    const [countryInfoSection, capital, population, region, flag]= [document.getElementById("country-info"), country.capital ? country.capital[0] : "N/A", country.population.toLocaleString(), country.region, country.flags.png];

    countryInfoSection.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${flag}" alt="${country.name.common} flag" width="100">
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${population}</p>
        <p><strong>Region:</strong> ${region}</p>
    `;
}

async function displayBorderingCountries(borderCodes) {
    const borderingCountriesSection = document.getElementById("bordering-countries");

    if (borderCodes.length === 0) {
        borderingCountriesSection.innerHTML = "<p>No bordering countries.</p>";
        return;
    }

    try {
        const borderCountries = await Promise.all(
            borderCodes.map(async (code) => {
                const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! `);
                }
                return response.json();
            })
        );

        borderCountries.forEach((countryData) => {
            const country = countryData[0];
            borderingCountriesSection.innerHTML += `
                <img src="${country.flags.png}" alt="${country.name.common} flag">
                <p>${country.name.common}</p>
            `;
        });
    } catch (error) {
        borderingCountriesSection.innerHTML = `<p class="error-message">Error fetching bordering countries.</p>`;
    }
}
