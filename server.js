const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();

// ✅ CORS FIX (VERY IMPORTANT)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));

// ✅ Upload middleware
const upload = multer();

// ✅ TEST ROUTE (IMPORTANT - prevents "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// ✅ MAIN API
app.post("/remove-bg", upload.single("image_file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, req.file.originalname);

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY // 🔐 from Render
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("REMOVE.BG ERROR:", errorText);
      return res.status(500).send(errorText);
    }

    const buffer = await response.arrayBuffer();

    res.set("Content-Type", "image/png");
    res.send(Buffer.from(buffer));

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).send("Server error");
  }
});

// ✅ PORT FIX (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
