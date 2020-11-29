const http = require('https');
const HTMLParser = require('node-html-parser');


var request = http.get("https://www.pcdiga.com/processador-amd-ryzen-5-5600x-6-core-3-7ghz-c-turbo-4-6ghz-35mb-sktam4", (response) => {
  var htmlpage = "";
  
  response.on('data', (data) => {
    htmlpage += data;
  });

  response.on('end', () => {
    //console.log(htmlpage);
    var page = HTMLParser.parse(htmlpage);
    //console.log(page);
    console.log(page.querySelectorAll(".stock_message")[0].outerHTML);

  });


});

