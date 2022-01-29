const { writeFile } = require("fs");
const { join } = require("path");
const axios = require("axios");
const blend = require("@mapbox/blend");

const cataasApi = axios.create({
  baseURL: "https://cataas.com/cat/says/",
});

const randomTexts = ["Hello", "you"];
const width = 400;
const height = 500;
const color = "Pink";
const size = 100;

const makeRequest = async (randomText, width, height, color, size) => {
  try {
    const { data } = await cataasApi.get(
      `/${randomText}?width=${width}&height=${height}&color=${color}&s=${size}`,
      { responseType: "binary" }
    );
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

const mergeImages = (imagesData) => {
  blend(
    [
      imagesData.map((imageData, index) => {
        return {
          buffer: new Buffer.from(imageData, "binary"),
          x: index * width,
          y: 0,
        };
      }),
    ],
    {
      width: width * imagesData.length,
      height: height,
      format: "jpeg",
    },
    (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      const fileOut = join(process.cwd(), `/cat-card.jpg`);
      writeFile(fileOut, data, "binary", (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("The file was saved!");
      });
    }
  );
};

const downloadMergeImage = () => {
  axios
    .all(
      randomTexts.map((randomText) => {
        return makeRequest(randomText, width, height, color, size);
      })
    )
    .then((imagesData) => {
      mergeImages(imagesData);
    });
};

downloadMergeImage();
