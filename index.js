import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();
const appID = process.env.AQI_TOKEN;
let finalAqi;
let verdict;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", {
    aqi: "",
    verdict: "",
  });
});
app.post("/get-aqi", async (req, res) => {
  const lat = req.body.lat;
  const long = req.body.long;
  const idApp = appID;
  try {
    const result = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${idApp}`
    );
    let aqi = result.data.list[0].main.aqi;
    finalAqi = aqi * 50;
    if (finalAqi <= 50) {
      verdict = "Go out and take a deep breath of that fresh air.🍃";
    } else if (finalAqi <= 100) {
      verdict = "Wake up early for a lungful of air!!🌬️";
    } else if (finalAqi > 100) {
      verdict = "Don't forget your mask when going outside.😷";
    } else if (finalAqi > 300) {
      verdict = "I think its better to stay indoors.🏠";
    }

    res.render("index.ejs", {
      aqi: finalAqi,
      verdict: verdict,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
