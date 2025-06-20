import express from "express";
import bodyParser from "body-parser";
import qr from "qr-image";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { qrSrc: null });
});

app.post("/generate", (req, res) => {
  const url = req.body.url;
  if (!url) return res.redirect("/");

  const qrSvg = qr.imageSync(url, { type: "png" });
  const base64Image = Buffer.from(qrSvg).toString("base64");
  const dataUri = `data:image/png;base64,${base64Image}`;

  // Extract hostname like youtube.com from the full URL
  let shortURL;
  try {
    const parsedURL = new URL(url);
    shortURL = parsedURL.hostname.replace("www.", ""); // e.g., youtube.com
  } catch {
    shortURL = url;
  }

  res.render("index", { qrSrc: dataUri, shortURL });
});


// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
