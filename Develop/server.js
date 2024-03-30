const express = require("express");
const path = require("path");
const fs = require("fs");

const uuid = require("./Helpers/uuid");



const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/public/notes.html")))
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json('Error in posting note');
            return;
        }
        res.status(200).json(JSON.parse(data));
    })
})
app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a note`);
    const { title, text } = req.body;
    if (title && text) {
        fs.readFile("./db/db.json", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json('Error in posting note');
                return;
            }
            const existingData = JSON.parse(data);
            const newNote = {
                title,
                text,
                id: uuid(),
            };
            existingData.push(newNote);
            const updatedDataString = JSON.stringify(existingData);
            fs.writeFile("./db/db.json",
                updatedDataString, (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                        res.status(500), json('Error in posting note');
                        return;
                    }
                });
            const response = {
                status: "success",
                body: newNote,
            };
            console.log(response);
            res.status(201).json(response);
        });
    } else {
        res.status(500).json('Error in posting note');
    }
});
app.get("*", (req, res) => 
    res.sendFile(path.join(__dirname, "/public/index.html")))
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);