const AV = require("leancloud-storage");

AV.init({
  appId: "Uukre5SsX3nQdSzBXKnsTfVp-gzGzoHsz",
  appKey: "u2cMVwGvQrBUMfO5pMv5kvC1"
});

const CLASS_NAME = "PhotoLib";
const PhotoStorage = AV.Object.extend(CLASS_NAME);
var photoQuery = new AV.Query(CLASS_NAME);

const photoStorage = new PhotoStorage();

const save = ({ tokenId, pngUrl }) => {
  console.log(`save photo with ${tokenId}`);
  return photoStorage.save({ tokenId: tokenId, pngUrl: pngUrl });
};

const fetch = ({ tokenId }) => {
  console.log(`fetch photo by ${tokenId}`);
  return photoQuery.equalTo("tokenId", tokenId).find();
};

module.exports = { save, fetch };
