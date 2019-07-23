import express, { Application } from "express";
import cors = require("cors");
import { getCertification } from "./proxy";
import { server } from "./https";
import { fetch, save } from "./photoStorage";

const port = 3000;
const app: Application = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

server(app, port, () => console.log(`https server listen on port ${port}`));

app.get("/certifications/:hashedCertificationId", (req, res) =>
  getCertification(req.params.hashedCertificationId).then(cert =>
    res.send(cert)
  )
);

app.post("/photos", function(req, res) {
  save(req.body).then(urls => {
    res.send(urls);
  }, console.error);
});

app.get("/photos/:certId", (req, res, next) => {
  fetch({ certId: req.params.certId }).then(results => {
    if (results.length > 0) {
      res.send(results[0]);
    } else {
      res.status(404).send(`No photos found for ${req.params.certId}`);
    }
  });
});
