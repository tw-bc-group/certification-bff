const express = require("express");
const cors = require("cors");
const { getCertification } = require("./proxy");
const https = require("./https");
const storage = require("./storage");
const port = 3000;

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static("dist"));

https(app, port, () => console.log(`https server listen on port ${port}`));

app.get("/certifications/:hashedCertificationId", (req, res) =>
  getCertification(req.params.hashedCertificationId).then(r => res.send(r))
);

app.post("/photos", function(req, res) {
  storage
    .save(req.body)
    .then(
      photo => res.send({ message: `photo created with id ${photo.id}` }),
      console.err
    );
});

app.get("/photos/:hashedCertificationId", (req, res) => {
  storage.fetch({ tokenId: req.params.hashedCertificationId }).then(results => {
    res.send(results[0]);
  });
});
