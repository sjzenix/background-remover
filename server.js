const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();

// ✅ Better CORS (allow your frontend)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

const upload = multer();

// ✅ ROUTE
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
        "X-Api-Key": process.env.REMOVE_BG_API_KEY // ✅ SAFE
      },
      body: formData
    });

    if (!response.ok) {
      const text = await response.text();
      console.log("REMOVE.BG ERROR:", text);
      return res.status(500).send(text);
    }

    const buffer = await response.arrayBuffer();

    res.set("Content-Type", "image/png");
    res.send(Buffer.from(buffer));

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).send("Server error");
  }
});

// ✅ IMPORTANT FOR RENDER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
