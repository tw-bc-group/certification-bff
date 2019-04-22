const https = require("https");
const fs = require("fs");

const wrap = (app, port, listener) => {
  const privateKey = fs.readFileSync("./privkey.pem", "utf8");
  const certificate = fs.readFileSync("./cert.pem", "utf8");

  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);
  listener();
  httpsServer.listen(port);
};

module.exports = wrap;
