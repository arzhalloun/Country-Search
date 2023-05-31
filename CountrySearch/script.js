
$(document).ready(function () {

const myAPI = {
    getAllData:'https://restcountries.com/v3.1/all', // the api key for all countries
    getSpecificData:'https://restcountries.com/v3.1/name/', // the api key for a specific country 
}
$('#main-div').hide();

$(".getAllBtn").click(getCountries);

$(".searchBtn").click(() => {
    const searchResult = $('.searchInput').val(); 
    specificCountries(searchResult);
});



// ERROR - WHEN THERE'S A TYPO OR COUNTRY IS MISSPELLED - works on for all countries api key
function getCountries() {
    fetchData(myAPI.getAllData)
        .then(countries => {
            if (countries.status > 300) {
                console.error(countries.status, countries.message);
                alert(`Error: ${countries.status} \nServer response was: ${countries.message}\nTry enter other search sequence`);
            } else {
                render(countries);
            }
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while fetching the data. Please try again later.');
        });
}


// ERROR - WHEN THERE'S A TYPO OR COUNTRY IS MISSPELLED - works on for specific countries api key

function specificCountries(searchResult) {
    fetchData(myAPI.getSpecificData + searchResult)
        .then(countries => {
            if (countries.status > 300) {
                console.error(countries.status, countries.message);
                alert(`Error: ${countries.status} \nServer response was: ${countries.message}\nTry enter other search sequence`);
            } else {
                render(countries);
            }
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while fetching the data. Please try again later.');
        });
}



// fetching the data

function fetchData(url) {
    return fetch(url)
        .then(res => res.json())
        .catch(error => error);
}


// Rendring 

function render(countries){
    renderStatistics(countries);
    renderCountrySection(countries);
    renderRegionSection(countries);
    renderCurrencySection(countries);
    $('#main-div').show();
}

// shows infromation about the search statics (total countries , population and average population)
function renderStatistics (countries){
    
    const totalCountries = countries.length;
    const totalPopulation = countries.reduce((total,country) => {return total + country.population}, 0);
    averagePopulation = totalPopulation / totalCountries;
    $('#totalCountries').html('').html('Total countries: ' + totalCountries);
    $('#totalPopulation').html('').html('Total countries Population: ' + totalPopulation);
    $('#averagePopulation').html('').html('Average Population: ' + averagePopulation);

}

// shows infromation about the country found (name of the country and its population)

function renderCountrySection(countries){
    $('#countriesSection').html('');
    for(const country of countries){
        const tr = `
        <tr>
            <td>${country.name.common}</td>
            <td>${country.population}</td>
        </tr>`;
        $('#countriesSection').append(tr);
    }
}

// shows infromation about the region of the country (from which continent and number of countries)

function renderRegionSection(countries){
    $('#regionSection').html(''); 
    const data = regionNums(countries);
    
    Object.keys(data).forEach((region) => {
        const tr = `
        <tr>
            <td>${region}</td>
            <td>${data[region]}</td>
        </tr>`;
        $('#regionSection').append(tr);
    });

}

// shows infromation about the currency of the country (name of the currency and how many countries uses this currency)

function renderCurrencySection(countries){
    $('#currencySection').html(''); 
    const data = currencyResult(countries);
    
    Object.keys(data).forEach((currency) => {
        const tr = `
        <tr>
            <td>${currency}</td>
            <td>${data[currency]}</td>
        </tr>`;
        $('#currencySection').append(tr);
    });
}

// function that returns number of countries in the region 
function regionNums(countries){  

    const resultData = {}; 
    
    for(let i =0; i<countries.length; i++){
        
        const key = countries[i].region;

        if(typeof resultData[key] == 'undefined'){
            resultData[key] = 1;
        }else{
            resultData[key] += 1;
        }

    }
    return resultData;
}

// function that returns how many countries uses the specific currency
function currencyResult(countries){  

    const resultData = {}; 
    console.log(countries);
    for(let i=0; i<countries.length; i++){
        
        const currencyObj = countries[i].currencies; 
        if(currencyObj == undefined){continue;} 
        const key = Object.values(currencyObj)[0].name; 
        console.log(Object.values('Number of currencies in ' + countries[i].name.common + ': ' + currencyObj).length);
          
        if(typeof resultData[key] == 'undefined'){
            resultData[key] = 1;
        }else{
            resultData[key] += 1;
        }

    }
    return resultData;
}


});
