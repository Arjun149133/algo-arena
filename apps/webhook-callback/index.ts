import express from "express";

const app = express();

app.use(express.json());

app.get("/webhook/run", async (req, res) => {
  res.status(200).json("OK");
});

app.put("/webhook/run", async (req, res) => {
  const data = req.body;
  console.log("called");
  console.log(data);

  res.status(200).send("OK");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
