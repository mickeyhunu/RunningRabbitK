import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import pageRouter from "./src/routes/pageRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "7d",
    etag: true,
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    },
  })
);

app.use("/", pageRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Not Found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const payload = {
    ok: false,
    message: err.message || "Internal Server Error",
    code: err.code,
  };

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
