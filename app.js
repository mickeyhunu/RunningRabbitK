import express from "express";

const app = express();
app.use(express.json());
app.use(cors()); // 필요시 도메인 제한

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => console.log(`Server listening on :${PORT}`));

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