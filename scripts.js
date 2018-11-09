// const API_URL = '/example.json?domain=';
const API_URL = 'http://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domains;

  function displayElement(element, text){
    const dl = document.createElement('dl');

    const domainElement = document.createElement('dt');
    domainElement.appendChild(document.createTextNode(text));
    dl.appendChild(domainElement);

    const domainValue = document.createElement('dd');
    console.log(domainValue)
    domainValue.appendChild(document.createTextNode(element));
    dl.appendChild(domainValue);

    return dl;
  }


  function displayDomain(thisDomain){
    if(thisDomain.length === 0) {
      displayError("Lén er ekki skráð");
      return;
    }

    const[{domain, registrantname, address, city, postalCode, country,
      phone, email, registered, expires, lastChange}] = thisDomain;
    
    const dlDomain =displayElement(domain, 'Lén');
    const dlRegisterd =displayElement(registered, 'Skráð');
    const dlLastChange =displayElement(lastChange, 'Seinast breytt');
    const dlExpires =displayElement(expires, 'Rennur út');
    const dlRegistrantname =displayElement(registrantname, 'Skráningaraðili');
    const dlEmail =displayElement(email, 'Netfang');
    const dlAddress =displayElement(address, 'Heimilisfang');
    const dlCountry =displayElement(country, 'Land');

    const container = domains.querySelector('.results');

    while(container.firstChild){
      container.removeChild(container.firstChild);
    }

    container.appendChild(dlDomain);
    container.appendChild(dlRegisterd);
    container.appendChild(dlLastChange);
    container.appendChild(dlExpires);

    console.log(dlRegistrantname);
    if(dlRegistrantname != null){
      container.appendChild(dlRegistrantname);
    }
    if(dlEmail != null){
      container.appendChild(dlEmail);
    }
    if(dlAddress != null){
      container.appendChild(dlAddress);
    }
    if(dlCountry != null){
      container.appendChild(dlCountry);
    }
  }

  function displayError(error){
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }


  function fetchData(domain) {
    fetch(`${API_URL}${domain}`)
      .then((response) => {
        //Virðist sem svarið okkar sé alltaf OK, þar er bara tómt ef lénið er ekki til
        //Skiilar stöðu 403 ef strengurinn er tómur, þ.e. ekki leitað af neinu
        if(response.ok) {
          return response.json();
        }

        throw new Error('Villa kom upp');
      })
      .then((data) => {
        displayDomain(data.results);
      })
      .catch((error) => {
        //Get líka set ekki það orð sem að ég vil að standi, þá stendur ekki þetta Error fyrir framan
        displayError('Lén verður að vera strengur');
        //TODO Villumeðhöndlun
        console.log(error);
      })
  }

  function onSubmit(e){
    e.preventDefault();

    const input = e.target.querySelector('input');
    console.log(input.value);

    // TODO Höndla tómastreng

    fetchData(input.value);
  }



  function init(_domains) {
    domains = _domains;

    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
