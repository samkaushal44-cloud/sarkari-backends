import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Job data uthana (FreeJobAlert se)
async function fetchJobs() {
  try {
    const url = "https://www.freejobalert.com/latest-notifications/";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let jobs = [];

    $("table tr").each((i, el) => {
      const title = $(el).find("td:nth-child(2) a").text().trim();
      const link = $(el).find("td:nth-child(2) a").attr("href");
      const date = $(el).find("td:nth-child(4)").text().trim();

      if (title && link) {
        jobs.push({
          title,
          link,
          date,
          type: title.toLowerCase().includes("state") ? "state" : "central"
        });
      }
    });

    return jobs;
  } catch (err) {
    console.error("Error:", err.message);
    return [];
  }
}

// Test page
app.get("/", (req, res) => {
  res.send("🚀 Sarkari Jobs Backend is Running");
});

// API: All jobs
app.get("/api/jobs", async (req, res) => {
  const jobs = await fetchJobs();
  res.json(jobs);
});

// API: Central jobs
app.get("/api/jobs/central", async (req, res) => {
  const jobs = await fetchJobs();
  res.json(jobs.filter(j => j.type === "central"));
});

// API: State jobs
app.get("/api/jobs/state", async (req, res) => {
  const jobs = await fetchJobs();
  res.json(jobs.filter(j => j.type === "state"));
});

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
