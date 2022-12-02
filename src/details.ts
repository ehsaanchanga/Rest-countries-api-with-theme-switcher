let detailsGrid = document.querySelector('.country-details');
let borderCountries;
byFields = `?fields=flag,name,nativeName,population,region,subregion,capital,topLevelDomain,currencies,languages,borders`;

type Country = {
  flag: string;
  name: string;
  nativeName: string;
  population: number;
  region: string;
  subregion: string;
  capital: string;
  topLevelDomain: string;
  currencies: { name: string }[];
  languages: { name: string }[];
  borders: [];
};

function countryDetailsStructure(data: Country) {
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
      ${
        data.borders == undefined
          ? "<strong class='warning'>no borders for this country...!</strong>"
          : `<strong> border countries:</strong> ${`
        <ul>
            ${data.borders
              .map(
                (border) => `
                <li data-border=${border} onclick="moreDetails(this)">
                <button
                  type="button"
                  class="button btn"
                  data-country-name="${data.name}"
                >
                ${border}
                </button>
              </li>`
              )
              .join('')}
          </ul>
      `}`
      }      
      </div>
    </div>
        `;
}

async function getCountryDetails() {
  let sessionValue = sessionStorage.getItem('id');
  try {
    let response = await fetch(
      `${baseApiLink}${byName}${sessionValue}${byFields}&fullText=true`
    );
    let data = await response.json();

    if (response.status == 404) {
      notifications(
        detailsGrid,
        `Sorry, country ${data.message}...`,
        'Please check spelling and try again'
      );
    } else {
      if (data) {
        controlLoader('open'); // Open
        detailsGrid!.classList.remove('no-grid', 'no-flex');
        detailsGrid!.innerHTML = '';
        data.forEach((country: any) => {
          detailsGrid!.innerHTML += countryDetailsStructure(country);
        });
        borderCountries = document.querySelectorAll('.col-3 li');
        controlLoader(); // Close
      } else {
        notifications(detailsGrid);
      }
    }
  } catch (error) {
    notifications(detailsGrid, 'Sorry something went wrong...', error);
  }
}
getCountryDetails();

async function getBorderDetails(value: string) {
  try {
    let response = await fetch(`${baseApiLink}${byAlpha}${value}${byFields}`);
    let data = await response.json();

    if (response.status == 404) {
      notifications(
        detailsGrid,
        `Sorry, country ${data.message}...`,
        'Please check spelling and try again'
      );
    } else {
      if (data) {
        controlLoader('open'); // Open
        detailsGrid!.classList.remove('no-grid', 'no-flex');
        detailsGrid!.innerHTML = '';
        detailsGrid!.innerHTML += countryDetailsStructure(data);
        controlLoader(); // Close
      } else {
        notifications(detailsGrid);
      }
    }
  } catch (error) {
    notifications(detailsGrid, 'Sorry something went wrong...', error);
  }
}

function moreDetails(el: { dataset: any }) {
  controlLoader('open'); // Open
  let countryName = el.dataset.border.toLocaleLowerCase().trim();
  getBorderDetails(countryName);
}
