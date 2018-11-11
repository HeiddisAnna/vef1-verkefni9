// const API_URL = '/example.json?domain=';
const API_URL = 'http://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domains;

  function displayLoading(){
    //empty(result);
    const container = domains.querySelector('.results');

    while(container.firstChild){
      container.removeChild(container.firstChild);
    }

    var loading = element('div');
    loading.classList.add('loading');

    var img = element('img');
    img.setAttribute('src', 'loading.gif');

    loading.appendChild(img);
    loading.appendChild(document.createTextNode('Leita að léni...'));
    container.appendChild(loading);
  }

  function element(name, child) {
    var el = document.createElement(name);

    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (typeof child === 'object') {
      el.appendChild(child)
    }
    return el;
  }


  function displayElement(element, text){
    const dl = document.createElement('dl');

    const domainElement = document.createElement('dt');
    domainElement.appendChild(document.createTextNode(text));
    dl.appendChild(domainElement);

    const domainValue = document.createElement('dd');
    
    //console.log(element.length > 0);
    domainValue.appendChild(document.createTextNode(element));
    dl.appendChild(domainValue);

    return dl;
  }

  function displayOptionalElement(element, text){
    if(element.length > 0){
      const dl = document.createElement('dl');

      const domainElement = document.createElement('dt');
      domainElement.appendChild(document.createTextNode(text));
      dl.appendChild(domainElement);

      const domainValue = document.createElement('dd');
      
      //console.log(element.length > 0);
      domainValue.appendChild(document.createTextNode(element));
      dl.appendChild(domainValue);

      return dl;
    }
    return null;
  }

  function displayDomain(thisDomain){
    if(thisDomain.length === 0) {
      displayError("Lén er ekki skráð");
      return;
    }

    const[{domain, registrantname, address, city, postalCode, country,
      phone, email, registered, expires, lastChange}] = thisDomain;

    //var n = registered.toISOString();
    //console.log(n);
    
    const dlDomain =displayElement(domain, 'Lén');
    const dlRegisterd =displayElement(registered, 'Skráð');
    const dlLastChange =displayElement(lastChange, 'Seinast breytt');
    const dlExpires =displayElement(expires, 'Rennur út');
    const dlRegistrantname =displayOptionalElement(registrantname, 'Skráningaraðili');
    const dlEmail =displayOptionalElement(email, 'Netfang');
    const dlAddress =displayOptionalElement(address, 'Heimilisfang');
    const dlCountry =displayOptionalElement(country, 'Land');

    const container = domains.querySelector('.results');

    while(container.firstChild){
      container.removeChild(container.firstChild);
    }

    container.appendChild(dlDomain);
    container.appendChild(dlRegisterd);
    container.appendChild(dlLastChange);
    container.appendChild(dlExpires);

    //console.log(dlRegistrantname);
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
    displayLoading();
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
        if(domain.length > 0){
          displayError('Villa við að sækja gögn');  // Hvað á að standa hér ??
        } else {
          displayError('Lén verður að vera strengur');
        }
      })
  }

  function onSubmit(e){
    e.preventDefault();

    const input = e.target.querySelector('input');

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
