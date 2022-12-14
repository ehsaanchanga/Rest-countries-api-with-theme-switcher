"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let detailsGrid = document.querySelector('.country-details');
let borderCountries;
byFields = `?fields=flag,name,nativeName,population,region,subregion,capital,topLevelDomain,currencies,languages,borders`;
function countryDetailsStructure(data) {
    return `
    <div class="country-flag">
      <img src=${data.flag} alt="${data.flag} Flag" />
    </div>
    <div class="country-info">
      <div class="col col-1">
        <h1 class="country-title">${data.name}</h1>
      </div>
      <div class="col col-2">
        <div class="col col-1">
          <ul>
            <li><strong>native name: </strong> ${data.nativeName}</li>
            <li><strong>population: </strong> ${data.population}</li>
            <li><strong>region: </strong> ${data.region}</li>
            <li><strong>sub region: </strong> ${data.subregion}</li>
            <li><strong>capital: </strong> ${data.capital}</li>
          </ul>
        </div>
        <div class="col col-2">
          <ul>
            <li><strong>top level domain: </strong> ${data.topLevelDomain}</li>
            <li><strong>currencies: </strong> ${data.currencies[0].name}</li>
            <li><strong>languages: </strong> ${data.languages
        .map((lang) => lang.name)
        .join(', ')}</li>
          </ul>
        </div>
      </div>
      <div class="col col-3">
      ${data.borders == undefined
        ? "<strong class='warning'>no borders for this country...!</strong>"
        : `<strong> border countries:</strong> ${`
        <ul>
            ${data.borders
            .map((border) => `
                <li data-border=${border} onclick="moreDetailes(this)">
                <button
                  type="button"
                  class="button btn"
                  data-country-name="${data.name}"
                >
                ${border}
                </button>
              </li>`)
            .join('')}
          </ul>
      `}`}      
      </div>
    </div>
        `;
}
function getCountryDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        let sessionValue = sessionStorage.getItem('id');
        try {
            let response = yield fetch(`${baseApiLink}${byName}${sessionValue}${byFields}&fullText=true`);
            let data = yield response.json();
            if (response.status == 404) {
                notifications(detailsGrid, `Sorry, country ${data.message}...`, 'Please check spelling and try again');
            }
            else {
                if (data) {
                    controlLoader('open'); // Open
                    detailsGrid.classList.remove('no-grid', 'no-flex');
                    detailsGrid.innerHTML = '';
                    data.forEach((country) => {
                        detailsGrid.innerHTML += countryDetailsStructure(country);
                    });
                    borderCountries = document.querySelectorAll('.col-3 li');
                    controlLoader(); // Close
                }
                else {
                    notifications(detailsGrid);
                }
            }
        }
        catch (error) {
            notifications(detailsGrid, 'Sorry something went wrong...', error);
        }
    });
}
getCountryDetails();
function getBorderDetails(value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let response = yield fetch(`${baseApiLink}${byAlpha}${value}${byFields}`);
            let data = yield response.json();
            if (response.status == 404) {
                notifications(detailsGrid, `Sorry, country ${data.message}...`, 'Please check spelling and try again');
            }
            else {
                if (data) {
                    controlLoader('open'); // Open
                    detailsGrid.classList.remove('no-grid', 'no-flex');
                    detailsGrid.innerHTML = '';
                    detailsGrid.innerHTML += countryDetailsStructure(data);
                    controlLoader(); // Close
                }
                else {
                    notifications(detailsGrid);
                }
            }
        }
        catch (error) {
            notifications(detailsGrid, 'Sorry something went wrong...', error);
        }
    });
}
function moreDetailes(el) {
    controlLoader('open'); // Open
    let countryName = el.dataset.border.toLocaleLowerCase().trim();
    getBorderDetails(countryName);
}
