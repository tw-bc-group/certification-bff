import https = require("https");
import fs = require("fs");
import { Application } from "express";

export const server: (
  app: Application,
  port: number,
  listener: () => void
) => void = (app, port, listener) => {
  const privateKey = fs.readFileSync("./privkey.pem", "utf8");
  const certificate = fs.readFileSync("./cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);
  listener();

  httpsServer.listen(port);
};
