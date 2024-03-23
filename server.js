
const express = require("express");
const path = require("path");
const fs = require("fs");

// This is the function for assigning a uuid
const uuid = require("./helpers/uuid")

// So i need to remove this
// const db = require("./db/db.json")



const app = express();
// This line is speciffic for hosting on a server like Heroku
const PORT = process.env.PORT || 3001;

// Middleware for using the data from the db files. 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uses the public file for the index and notes html and assets. 
app.use(express.static('public'));

// Get routes for the /notes page and the API containing the data. 
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


// Post route for saving a new note
app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a note`);

    // Deconstructing assignment for the items in req.body
    const { title, text } = req.body;

    // Checks if all data is present at submit. 
    if (title && text) {

        // This gets the data in the db JSON file
        fs.readFile("./db/db.json", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json('Error in posting note');
                return;
            }

            // Current data in the db file
            const existingData = JSON.parse(data);

            // Creates a new Note
            const newNote = {
                title,
                text,
                id: uuid(),
            };

            // This adds the new note data to the existing data in the db file. 
            existingData.push(newNote);

            const updatedDataString = JSON.stringify(existingData);


            // This creates a new db file with the updated data
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

// Catch all for any other url locations. 
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "/public/index.html")))


app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);