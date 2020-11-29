const https = require('https');
const HTMLParser = require('node-html-parser');
const pageToCheck = "https://www.pcdiga.com/smartphone-xiaomi-redmi-note-9-6-53-3gb-64gb-dual-sim-preto";
const parseOptions = {blockTextElements:{script:true,noscript:true,style:true,pre:true}};
const pageURL = new URL(pageToCheck);
console.log(pageURL.hostname);



var request = https.get(pageToCheck, (response) => {
  var htmlpage = "";
  
  response.on('data', (data) => {
    htmlpage += data;
  });

  response.on('end', () => {
    
    switch (pageURL.hostname) {
      case "pcdiga.com":
      case "www.pcdiga.com":
        if (htmlpage.slice(htmlpage.search("is_in_stock") + 14, htmlpage.search("is_in_stock") + 15) == "1")
          console.log("Em stock");
        else
          console.log("Esgotado");
        break;
      case "globaldata.pt": 
      case "www.globaldata.pt": 
        var page = HTMLParser.parse(htmlpage,parseOptions);
        page.querySelectorAll(".stock-shops")[0].removeWhitespace();
        console.log(page.querySelectorAll(".stock-shops")[0].childNodes[0].innerHTML);
        break;
    
    
    
    }
    
  });


});

