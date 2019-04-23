const express = require("express");
const cors = require("cors");
const history = require('connect-history-api-fallback');
const { getCertification } = require("./proxy");
const https = require("./https");
const storage = require("./photoStorage");
const port = 3000;

const app = express();

app.use(cors());
app.use(history());
app.use(express.json({ limit: "5mb" }));
app.use(express.static("dist"));

https(app, port, () => console.log(`https server listen on port ${port}`));

app.get("/certifications/:hashedCertificationId", (req, res) =>
  getCertification(req.params.hashedCertificationId).then(r => res.send(r))
);

app.post("/photos", function(req, res) {
  storage.save(req.body).then(urls => {
    res.send(urls);
  }, console.err);
});

app.get("/photos/:certId", (req, res, next) => {
  storage.fetch({ certId: req.params.certId }).then(results => {
    if (results.length > 0) {
      res.send(results[0]);
    } else {
      res.status(404).send(`No photos found for ${req.params.certId}`);
    }
  });
});
