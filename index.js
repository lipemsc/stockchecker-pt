const https = require('https');
const HTMLParser = require('node-html-parser');
const parseOptions = {blockTextElements:{script:true,noscript:true,style:true,pre:true}};

function printHelp() {
  console.log("Utilização: node index.js \[\<URL\>\] \[-h|--help\] \nOpções\:\n  --help | -h       Mostra esta ajuda e sai.");
}

function pcdiga(pageData) {
  if (pageData.slice(pageData.search("is_in_stock") + 14, pageData.search("is_in_stock") + 15) == "1")
    return "Em stock";
  else if(pageData.slice(pageData.search("is_in_stock") + 14, pageData.search("is_in_stock") + 15) == "0")
    return "Esgotado";
  else
    return "Erro"
}

function globaldata(pageData) {
  var parsedPage = HTMLParser.parse(pageData,parseOptions);
  parsedPage.querySelectorAll(".stock-shops")[0].removeWhitespace();
  return parsedPage.querySelectorAll(".stock-shops")[0].childNodes[0].innerHTML;
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

