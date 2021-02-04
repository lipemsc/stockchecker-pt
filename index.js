const https = require('https');
const HTMLParser = require('node-html-parser');
const parseOptions = {blockTextElements:{script:true,noscript:true,style:true,pre:true}};

function printHelp() {
  console.log("Utilização: node index.js \[\<URL\>\] \[-h|--help\] \nOpções\:\n  --help | -h       Mostra esta ajuda e sai.");
}

function pcdiga(pageData) {
  var parsedPage = HTMLParser.parse(pageData,parseOptions);
  try {
    parsedPage.querySelectorAll("#skrey_estimate_date_product_page_wrapper")[0].removeWhitespace();
    return parsedPage.querySelectorAll("#skrey_estimate_date_product_page_wrapper")[0].childNodes[0].innerHTML;
  }
  catch {
    //console.log(pageData.search("skrey_estimate_date_product_page_wrapper"));
    if(pageData.search("skrey_estimate_date_product_page_wrapper") === -1)
      return "Erro";
    else
      return "Em stock";
  }
}

function globaldata(pageData) {
  var parsedPage = HTMLParser.parse(pageData,parseOptions);
  parsedPage.querySelectorAll(".availability-text")[0].removeWhitespace();
  return parsedPage.querySelectorAll(".availability-text")[0].childNodes[1].innerHTML.slice(9);
}

function pccomponentes(pageData) {
  var parsedPage = HTMLParser.parse(pageData,parseOptions);
  var productInfo = JSON.parse(parsedPage.querySelector("#microdata-product-script").innerHTML);
  if(productInfo.offers.availability == "http://schema.org/InStock" || productInfo.offers.availability == "http://schema.org/LimitedAvailability" || productInfo.offers.availability == "http://schema.org/OnlineOnly" || productInfo.offers.availability == "http://schema.org/PreSale")
    return "Em stock";
  else if(productInfo.offers.availability == "http://schema.org/PreOrder")
    return "Pré-Reserva";
  else if(productInfo.offers.availability == "http://schema.org/Discontinued" || productInfo.offers.availability == "http://schema.org/OutOfStock" || productInfo.offers.availability == "http://schema.org/SoldOut")
    return "Esgotado";
  else
    return "Erro";
}

function getPage(url) {
  var htmlPage = "";
  var request = https.get(pageURL.toString(), (response) => {
    response.on('data', (data) => {
      htmlPage += data;
    });

    response.on('end', () => {
      var result;
      var currentTime = new Date();
      currentTime.setTime(Date.now());
      console.log(currentTime.getUTCFullYear() + "-" + (("0" + (currentTime.getUTCMonth()+1)).slice(-2)) + "-" + ("0" + currentTime.getUTCDate()).slice(-2) + " " + ("0" + currentTime.getUTCHours()).slice(-2) + ":" + ("0" + currentTime.getUTCMinutes()).slice(-2) + ":" + ("0" + currentTime.getUTCSeconds()).slice(-2) + " - " + processPage(htmlPage));
      setTimeout(getPage, 5000);
    });

  });
}

function processPage (pageData) {    
  switch (pageURL.hostname) {
    case "pcdiga.com":
    case "www.pcdiga.com":
      return pcdiga(pageData);
      break;
    case "globaldata.pt": 
    case "www.globaldata.pt": 
      return globaldata(pageData);
      break;
    case "pccomponentes.pt":
    case "www.pccomponentes.pt":
      return pccomponentes(pageData);
    default:
      return false;
  }
};

if (typeof process.argv[2] !== 'undefined') {
  if(process.argv[2] == "--help" || process.argv[2] == "-h")
    printHelp();
  else {
    try {
      var pageURL = new URL(process.argv[2]);
      switch (pageURL.hostname) {
        case "pcdiga.com":
        case "www.pcdiga.com":
        case "globaldata.pt": 
        case "www.globaldata.pt":
        case "pccomponentes.pt":
        case "www.pccomponentes.pt":
          break;
        default:
          console.log("Erro: Website não suportado");
          return false;
      }
      getPage(pageURL);
    }
    catch {
      console.log("Erro: url incorreto.\nUse --help para obter ajuda.");
    }
  }
}
else
  console.log("Erro: url inexistente.\nUse --help para obter ajuda.");

