const express = require("express");
const authRouter = require("./routes/auth");

//Mongoose conection
const mongoose = require('mongoose');

//Initializtion
const PORT = 3000;
const app = express();

//middleware
app.use(express.json());
app.use(authRouter);

const DB = "mongodb+srv://vibhavtrivedi15:vibhav24@cluster0.plfetoc.mongodb.net/?retryWrites=true&w=majority";

//Connection to DB
mongoose.connect(DB).then(() => {
    console.log("Connection Successful");
}).catch((e) => {
    console.log("error", e);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected to port ${PORT}`);
});