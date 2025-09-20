const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const News = require("../src/models/News");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const data = JSON.parse(fs.readFileSync("final_summaries.json", "utf-8"));

async function importData() {
  try {
    const formatted = data.map(n => ({
      title: n.representative_headline,
      content: n.final_summary,
      category: "general", // or infer from JSON if available
    }));

    await News.insertMany(formatted);
    console.log("✅ News imported!");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

importData();
