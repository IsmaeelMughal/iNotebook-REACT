const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");

// ROUTE 1 : Get all the notes of logged in user GET: /api/notes/fetchallnotes loginRequired
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    console.log(notes);
    res.json(notes);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error!!!");
  }
});

// ROUTE 2 : Add a new Note POST: /api/notes/addnote loginRequired
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Title must be of atleast 3 characters").isLength({ min: 3 }),
    body("description", "Description must be of 5 letters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors) {
        return res.status(400).json({ error: errors.array() });
      }

      const { title, description, tag } = req.body;
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savednote = await note.save();
      res.json(savednote);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error!!!");
    }
  }
);

// ROUTE 3 : Update Note PUT: /api/notes/updatenote loginRequired
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    // create a new note object
    let newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // find the note to be updated
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found!!!");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed!!!");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ note });
  } catch (error) {
    return res.status(500).send("Internal Server Error!!!");
  }
});

// ROUTE 4 : Delete Note DELETE: /api/notes/deletenote loginRequired
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // find the note to be updated
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found!!!");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed!!!");
    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.json({
      Success: "Note Has Been Deleted",
      note: note,
    });
  } catch (error) {
    return res.status(500).send("Internal Server Error!!!");
  }
});

module.exports = router;
