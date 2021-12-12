let posibleCountries = new Set();
let posibleInsustries = new Set();
let companies = null;
let displayCompanies = null;
let sortByNameState = 1;
let sortByNumberState = 1;




function redrawTableElements(companies) {
    const table = document.getElementById("data");
    let newTable = document.createElement('tbody');

    newTable.id = 'data';

    companies.map(company => {
        var row = document.createElement("tr");
        var cellName = document.createElement("td");
        var cellCountry = document.createElement("td");
        var cellIndustry = document.createElement("td");
        var cellNumberOfEmployees = document.createElement("td");

        cellName.innerHTML = company.name;
        cellCountry.innerHTML = company.country;
        cellIndustry.innerHTML = company.industry;
        cellNumberOfEmployees.innerHTML = company.numberOfEmployees;

        row.appendChild(cellName);
        row.appendChild(cellCountry);
        row.appendChild(cellIndustry);
        row.appendChild(cellNumberOfEmployees);

        newTable.appendChild(row);
    });

    table.replaceWith(newTable);
}

function prepareAndAddCountryFilters() {
    let countrySelect = document.getElementById('filterCountries');
    posibleCountries.forEach(country => {
        var option = document.createElement("option");
        option.value = country;
        option.text = country;
        countrySelect.appendChild(option);
        countrySelect.selectedIndex = -1
    });
}

function prepareAndAddIndustryFilters() {
    let industrySelect = document.getElementById('filterIndustries');
    posibleInsustries.forEach(industry => {
        var option = document.createElement("option");
        option.value = industry;
        option.text = industry;
        industrySelect.appendChild(option);
        industrySelect.selectedIndex = -1
    });
}

function fetchData() {
    fetch("https://dujour.squiz.cloud/developer-challenge/data")
        .then(response => {
            if (!response.ok) {
                throw Error("ERROR");
            }
            return response.json();
        })
        .then(data => {
            companies = data;

            companies.forEach(company => {
                posibleCountries.add(company.country);
            });

            companies.forEach(company => {
                posibleInsustries.add(company.industry);
            });

            displayCompanies = companies;
        })
        .then(() => {
            prepareAndAddIndustryFilters();
            prepareAndAddCountryFilters();
            redrawTableElements(companies);
        })
        .catch(error => {
            console.log(error);
        });
}

function onFilterCountries(event) {
    displayCompanies = displayCompanies?.filter(company => company.country === event.target.value);
    redrawTableElements(displayCompanies);
}

function onFilterIndustries(event) {
    displayCompanies = displayCompanies?.filter(company => company.industry === event.target.value);
    redrawTableElements(displayCompanies);
}

function clear() {
    redrawTableElements(companies);
    filterCountries.selectedIndex = -1;
    filterIndustries.selectedIndex = -1;
    sortByNumberState = 1;
    sortByNameState = 1;
    document.getElementById('thead').querySelector(".name").classList.remove("asc","desc" );
    document.getElementById('thead').querySelector(".number").classList.remove("asc","desc" );

    displayCompanies = companies;
}

function sortByName() {
    let sortedCompanies = displayCompanies.sort((a, b) => {
        if (a.name > b.name) {
            return 1 * sortByNameState;
        }
        if (a.name < b.name) {
            return -1 * sortByNameState;
        }

        return 0;
    });

    sortByNameState *= -1;

    document.getElementById('thead').querySelector(".name").classList.add(sortByNameState === 1 ? "asc" : "desc");
    document.getElementById('thead').querySelector(".name").classList.remove(sortByNameState !== 1 ? "asc"  : "desc" );
    redrawTableElements(sortedCompanies);
}

function sortByNumber() {
    let sortedCompanies = displayCompanies.sort((a, b) => {
        if (a.numberOfEmployees > b.numberOfEmployees) {
            return 1 * sortByNumberState;
        }
        if (a.numberOfEmployees < b.numberOfEmployees) {
            return -1 * sortByNumberState;
        }

        return 0;
    });

    sortByNumberState *= -1;

    document.getElementById('thead').querySelector(".number").classList.add(sortByNumberState === 1 ? "asc" : "desc");
    document.getElementById('thead').querySelector(".number").classList.remove(sortByNumberState !== 1 ? "asc"  : "desc" );

    redrawTableElements(sortedCompanies);
}




let filterCountries = document.getElementById('filterCountries');
filterCountries.addEventListener('change', onFilterCountries);

let filterIndustries = document.getElementById('filterIndustries');
filterIndustries.addEventListener('change', onFilterIndustries);

document.getElementById('clearButton').addEventListener('click', clear);

document.getElementById('sortByNumberButton').addEventListener('click', sortByNumber);

document.getElementById('sortByNameButton').addEventListener('click', sortByName);

fetchData();





