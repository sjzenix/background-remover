const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
app.use(cors());

const upload = multer();

app.post("/remove-bg", upload.single("image_file"), async (req, res) => {
  try {
    // ✅ check if file exists
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, req.file.originalname);

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": "Z4j28hizY3vZhkZvTVhHCzdc" // 🔥 FIX HERE
      },
      body: formData
    });

    if (!response.ok) {
  const text = await response.text();
  console.log("🔥 REMOVE.BG ERROR FULL:", text); // force visible
  return res.status(500).send(text);
}
    const buffer = await response.buffer();

    res.set("Content-Type", "image/png");
    res.send(buffer);

  } catch (err) {
  console.log("🔥 SERVER ERROR FULL:", err);
  res.status(500).send("Server error");
}
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});