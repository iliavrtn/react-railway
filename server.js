const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = 5000;

const stations = [
  { label: "Tel Aviv Savidor Center", id: 3700 },
  { label: "Hertsliya", id: 3500 },
  { label: "Hadera West", id: 3100 },
  { label: "Binyamina", id: 2800 },
  { label: "Haifa Bat Galim", id: 2200 },
  { label: "Hutsot Hamifrats", id: 1300 },
  { label: "Kiryat Hayim", id: 700 },
  { label: "Kiryat Motzkin", id: 1400 },
  { label: "Haifa Hof Hakarmel (Razi'el)", id: 2300 },
  { label: "Kiryat Gat", id: 7000 },
  { label: "Lod", id: 5000 },
  { label: "Beer Sheva North/University", id: 7300 },
  { label: "Tel Aviv Hashalom", id: 4600 },
  { label: "Haifa Center Hashmona", id: 2100 },
  { label: "Ramla", id: 5010 },
  { label: "Tel Aviv University", id: 3600 },
  { label: "Beer Sheva Center", id: 7320 },
  { label: "Hamifrats Central Station", id: 1220 },
  { label: "Tel Aviv Hahagana", id: 4900 },
  { label: "Lehavim Rahat", id: 8550 },
  { label: "Ahihud", id: 1820 },
  { label: "Karmiel", id: 1840 },
  { label: "Mazkeret Batya", id: 6900 },
];

function findIdByLabel(label) {
  const station = stations.find((station) => station.label === label);
  return station ? station.id : null;
}

app.get("/", async (req, res) => {
  const { src, dest } = req.query;

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
          date: "2024-03-27",
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
