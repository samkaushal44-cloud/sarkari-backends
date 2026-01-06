const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Sarkari Jobs Backend is Running 🚀");
});

// 🔹 SCRAPE FROM FREEJOBALERT
app.get("/api/jobs", async (req, res) => {
  try {
    const url = "https://www.freejobalert.com/";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let jobs = [];

    $("table#hp_table tr").each((i, el) => {
      const title = $(el).find("td:nth-child(2) a").text().trim();
      const link = $(el).find("td:nth-child(2) a").attr("href");
      const date = $(el).find("td:nth-child(1)").text().trim();

      if (title && link) {
        jobs.push({
          title: title,
          date: date,
          link: "https://www.freejobalert.com" + link,
          source: "FreeJobAlert"
        });
      }
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
