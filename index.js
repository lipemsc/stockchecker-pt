const https = require('https');
const HTMLParser = require('node-html-parser');
const pageToCheck = "https://www.pcdiga.com/alisador-de-cabelo-rowenta-for-elite-optiliss";
const parseOptions = {blockTextElements:{script:true,noscript:true,style:true,pre:true}};
const pageURL = new URL(pageToCheck);

function getPage() {
  var htmlPage = "";
  var request = https.get(pageToCheck, (response) => {
    response.on('data', (data) => {
      htmlPage += data;
    });

    response.on('end', () => {
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
      if (pageData.slice(pageData.search("is_in_stock") + 14, pageData.search("is_in_stock") + 15) == "1")
        return "Em stock";
      else
        return "Esgotado";
      break;
    case "globaldata.pt": 
    case "www.globaldata.pt": 
      var parsedPage = HTMLParser.parse(pageData,parseOptions);
      parsedPage.querySelectorAll(".stock-shops")[0].removeWhitespace();
      return parsedPage.querySelectorAll(".stock-shops")[0].childNodes[0].innerHTML;
      break;
    default:
      return "Site não suportado";
  }
};

getPage();
