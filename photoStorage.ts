import AV from "leancloud-storage";
import config from "config";

AV.init({
  appId: config.get("leancloud.appId"),
  appKey: config.get("leancloud.appKey")
});

const LEANCLOUD_CLASS = "Photo";
const INDEX = "certId";

export const fetch: ({ certId }: { certId: string }) => Promise<Object[]> = ({
  certId
}) => {
  var query = new AV.Query(LEANCLOUD_CLASS);
  query.equalTo(INDEX, certId);
  query.include(["png", "svg"]);
  return query.find();
};

export const save: ({
  certId,
  photos
}: {
  certId: string;
  photos: Array<{ fileName: string; dataUrl: string }>;
}) => Promise<{ pngUrl: string; svgUrl: string }> = ({ certId, photos }) => {
  const mark = "base64,";
  const [png, svg, ...tail] = photos.map(({ fileName, dataUrl }) => {
    const data = dataUrl.substring(dataUrl.indexOf(mark) + mark.length);
    return new AV.File(fileName, { base64: data });
  });

  return Promise.all([png.save(), svg.save()])
    .then(([pngFile, svgFile]) => {
      let photo = new AV.Object(LEANCLOUD_CLASS);
      photo.set(INDEX, certId);
      photo.set("png", pngFile);
      photo.set("svg", svgFile);
      return photo.save();
    })
    .then(photoObj => {
      const png = photoObj.get("png");
      const pngUrl = png.url();
      console.log("png.url", pngUrl);
      const svg = photoObj.get("svg");
      const svgUrl = svg.url();
      console.log("svg.url", svgUrl);
      return { pngUrl, svgUrl };
    });
};
