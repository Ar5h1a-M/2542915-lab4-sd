
document.getElementById("submitButton").addEventListener("click", function() {
    const cntryName = document.getElementById("countryName").value;
    fetchCountryData(cntryName);
});

async function fetchCountryData(cntryName) {
    const countryInfoSect = document.getElementById("country-info");
    const borderingCountriesSect = document.getElementById("bordering-countries");

    countryInfoSect.innerHTML = ""; 
    borderingCountriesSect.innerHTML = "";  

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${cntryName}?fullText=true`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const count_list = await response.json();
        const country = count_list[0]; 
        
        displayCountryInfo(country);
        displayBorderingCountries(country.borders);

    } catch (error) {
        countryInfoSect.innerHTML = `<p class="error-message">Error fetching countries.</p>`;
    }
}

function displayCountryInfo(country) {
    
    const countryInfoSect = document.getElementById("country-info");
    const capital = country.capital ? country.capital[0] : "N/A";
    const population = country.population.toLocaleString();
    const region = country.region;
    const flag = country.flags.png;

    countryInfoSect.innerHTML = `
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
