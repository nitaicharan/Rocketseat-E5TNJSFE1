import express from "express";

const app = express();


app.get("/", (req, res) => res.json({
    message: "Hello NLW 05",
}));

app.post("/", (req, res) => res.json({
    message: "Success user saved!"
}));

app.put("/", (req, res) => res.json({
    message: "Success user saved!"
}));

app.listen(3333, () => console.log("Server is running on port 3333"));