const { parse } = require("url");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const fs = require("fs");
const handle = app.getRequestHandler();
let appInsights = require('applicationinsights');

let connectionString = "InstrumentationKey=8ebc45f5-8fe9-45f8-8c6b-163bef68b05e;IngestionEndpoint=https://southeastasia-1.in.applicationinsights.azure.com/;LiveEndpoint=https://southeastasia.livediagnostics.monitor.azure.com/";
appInsights.setup(connectionString);
appInsights.start();

let httpsOptions = {};
var { createServer } = require("http");
if (dev) {
  var { createServer } = require("https");
  httpsOptions = {
    key: fs.readFileSync("./dev/cert/localhost.key"),
    cert: fs.readFileSync("./dev/cert/localhost.crt"),
  };
}

const PORT = process.env.PORT || 8080;

app.prepare().then(async () => {
  createServer(httpsOptions, (req, res) => {
    const logoRgex = /\/rooms\/([A-Z]{4})\/logo.(jpeg|gif|png)/
    if(logoRgex.test(req.url)) {
        const matched = req.url.match(logoRgex)
        fs.readFile(`./public/rooms/${matched[1]}/logo.${matched[2]}`, function(err, data) {
            res.end(data);
        });
    }else{
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${PORT}`);
  });
});
