const https = require('https');
const HTMLParser = require('node-html-parser');
const pageToCheck = "https://www.globaldata.pt/grafica-msi-geforce-rtx-3080-gaming-x-trio-10g-4719072762544";
const parseOptions = {blockTextElements:{script:true,noscript:true,style:true,pre:true}};

var request = https.get(pageToCheck, (response) => {
  var htmlpage = "";
  
  response.on('data', (data) => {
    htmlpage += data;
  });

  response.on('end', () => {
    //console.log(htmlpage);
    var page = HTMLParser.parse(htmlpage,parseOptions);
    //console.log(page);
    page.querySelectorAll(".stock-shops")[0].removeWhitespace();
    console.log(page.querySelectorAll(".stock-shops")[0].childNodes[0].innerHTML);

  });


});

