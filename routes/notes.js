const fetchuser = require("../middleware/fetchuser");
const express = require("express");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const router = express.Router();

//Route 1 : Fetch All Notes : Get "/api/notes/fetchallnotes" Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//Route 2 : Add a new Note : Post "/api/notes/addnote" Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Title must contain minimum 1 character").isLength({
      min: 1,
    }),
    body("description", "description must be atleast 3 characters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Checking if there any errors related to user fields
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Creating Note and Adding to MongoDB
    try {
      const title = req.body.title;
      const description = req.body.description;
      const tag = req.body.tag;

      const note = new Note({
        user: req.user.id,
        title,
        description,
        tag,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route 3 : Update existing Note : Put "/api/notes/updatenote" Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  //const errors = validationResult(req);
  // Checking if there any errors related to user fields
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ errors: errors.array() });
  //   }
  // Updating a Note
  try {
    const title = req.body.title;
    const description = req.body.description;
    const tag = req.body.tag;

    //Create a newNote
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find the note to be updated and update it

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not found");
    }
    //Is user valid to update a note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//Route : 4 Delete an existing note Delete  "/api/notes/deletenote" Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  //Find the note to be deleted and delete it
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not found");
    }
    //Is user valid to delete a note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    //deleting the note
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});

module.exports = router;
