const express = require("express");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 5000;

const stations = [{'label': 'Afula R.Eitan', 'id': 1260}, {'label': 'Ahihud', 'id': 1820}, {'label': 'Ako', 'id': 1500}, {'label': 'Ashdod-Ad Halom (M.Bar Kochva)', 'id': 5800}, {'label': 'Ashkelon', 'id': 5900}, {'label': 'Atlit', 'id': 2500}, {'label': 'Bat Yam-Komemiyut', 'id': 4690}, {'label': 'Bat Yam-Yoseftal', 'id': 4680}, {'label': "Be'er Sheva-Center", 'id': 7320}, {'label': "Be'er Sheva-North/University", 'id': 7300}, {'label': "Be'er Ya'akov", 'id': 5300}, {'label': "Beit She'an", 'id': 1280}, {'label': 'Ben Gurion Airport', 'id': 8600}, {'label': 'Bet Shemesh', 'id': 6300}, {'label': "Bet Yehoshu'a", 'id': 3400}, {'label': 'Binyamina', 'id': 2800}, {'label': 'Bnei Brak', 'id': 4100}, {'label': 'Caesarea-Pardes Hana', 'id': 2820}, {'label': 'Dimona', 'id': 7500}, {'label': 'HaMifrats Central Station', 'id': 1220}, {'label': 'Hadera-West', 'id': 3100}, {'label': 'Haifa Center-HaShmona', 'id': 2100}, {'label': 'Haifa-Bat Galim', 'id': 2200}, {'label': 'Haifa-Hof HaKarmel (Razi`el)', 'id': 2300}, {'label': 'Hertsliya', 'id': 3500}, {'label': 'Hod HaSharon-Sokolov', 'id': 9200}, {'label': 'Holon Junction', 'id': 4640}, {'label': 'Holon-Wolfson', 'id': 4660}, {'label': 'Hutsot HaMifrats', 'id': 1300}, {'label': 'Jerusalem - Yitzhak Navon', 'id': 680}, {'label': 'Jerusalem-Biblical Zoo', 'id': 6500}, {'label': 'Jerusalem-Malha', 'id': 6700}, {'label': 'Karmiel', 'id': 1840}, {'label': 'Kfar Habad', 'id': 4800}, {'label': 'Kfar Sava-Nordau (A.Kostyuk)', 'id': 8700}, {'label': 'Kiryat Gat', 'id': 7000}, {'label': 'Kiryat Hayim', 'id': 700}, {'label': 'Kiryat Malakhi – Yoav', 'id': 6150}, {'label': 'Kiryat Motzkin', 'id': 1400}, {'label': 'Lehavim-Rahat', 'id': 8550}, {'label': 'Lod', 'id': 5000}, {'label': 'Lod-Gane Aviv', 'id': 5150}, {'label': 'Mazkeret Batya', 'id': 6900}, {'label': "Migdal Ha'emek-Kfar Barukh", 'id': 1250}, {'label': "Modi'in-Center", 'id': 400}, {'label': 'Nahariya', 'id': 1600}, {'label': 'Netanya', 'id': 3300}, {'label': 'Netanya-Sapir', 'id': 3310}, {'label': 'Netivot', 'id': 9650}, {'label': 'Ofakim', 'id': 9700}, {'label': "Pa'ate Modi'in", 'id': 300}, {'label': 'Petah Tikva-Kiryat Arye', 'id': 4170}, {'label': 'Petah Tikva-Segula', 'id': 4250}, {'label': "Ra'anana South", 'id': 2960}, {'label': "Ra'anana West", 'id': 2940}, {'label': 'Ramla', 'id': 5010}, {'label': 'Rehovot (E. Hadar)', 'id': 5200}, {'label': 'Rishon LeTsiyon-HaRishonim', 'id': 9100}, {'label': 'Rishon LeTsiyon-Moshe Dayan', 'id': 9800}, {'label': "Rosh Ha'Ayin-North", 'id': 8800}, {'label': 'Sderot', 'id': 9600}, {'label': 'Tel Aviv-HaHagana', 'id': 4900}, {'label': 'Tel Aviv-HaShalom', 'id': 4600}, {'label': 'Tel Aviv-Savidor Center', 'id': 3700}, {'label': 'Tel Aviv-University', 'id': 3600}, {'label': 'Yavne-East', 'id': 5410}, {'label': 'Yavne-West', 'id': 9000}, {'label': "Yokne'am-Kfar Yehoshu'a", 'id': 1240}];

function findIdByLabel(label) {
  const station = stations.find((station) => station.label === label);
  return station ? station.id : null;
}

app.get("/run-script", async (req, res) => {
  const { src, dest, date } = req.query;

  // Validate src and dest
  if (!src || !dest) {
    return res
      .status(400)
      .send("Please provide both source and destination stations.");
  }

  try {
    // Get station IDs
    const srcId = findIdByLabel(src);
    const destId = findIdByLabel(dest);

    // Make request to external API
    const response = await axios.get(
      `https://israelrail.azurefd.net/rjpa-prod/api/v1/timetable/searchTrainLuzForDateTime`,
      {
        params: {
          fromStation: srcId,
          toStation: destId,
          date: date,
          hour: "5:00",
          scheduleType: 1,
          systemType: 2,
          languageId: "Hebrew",
        },
        headers: {
          "Ocp-Apim-Subscription-Key": "4b0d355121fe4e0bb3d86e902efe9f20",
        },
      }
    );

    // Send JSON response to client
    res.json(response.data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).send("Error occurred while fetching data.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
