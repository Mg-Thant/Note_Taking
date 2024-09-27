const { validationResult } = require("express-validator");

const Note = require("../models/note");
const { fileDel } = require("../utils/fileDel");

exports.getNotes = (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const notePerPage = 6;
  let totalNotes;

  Note.find()
    .countDocuments()
    .then((countNotes) => {
      totalNotes = countNotes;
      return Note.find()
        .populate("creator", "username")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * notePerPage)
        .limit(notePerPage);
    })
    .then((notes) => {
      return res.status(200).json({
        notes,
        totalNotes,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong",
      });
    });
};

exports.createnote = (req, res, next) => {
  const errors = validationResult(req);
  const { title, content } = req.body;
  const image = req.file;

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation Failed",
      errorMessages: errors.array(),
    });
  }

  Note.create({
    title,
    content,
    cover_image: image ? image.path : undefined,
    creator: req.userId,
  })
    .then((_) => {
      return res.status(201).json({
        message: "Note Created",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong",
      });
    });
};

exports.getNote = (req, res, next) => {
  const { id } = req.params;

  Note.findById(id)
    .populate("creator", "username")
    .then((note) => {
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      return res.status(200).json(note);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong",
      });
    });
};

exports.deleteNote = (req, res, next) => {
  const { id } = req.params;

  Note.findById(id)
    .then((note) => {
      if (note.creator.toString() !== req.userId) {
        return res.status(401).json("Auth Failed");
      }
      if (note.cover_image) {
        fileDel(note.cover_image);
      }
      return Note.findByIdAndDelete(id).then(() => {
        return res.status(204).json({
          message: "Note Deleted",
        });
      });
    })

    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Somethign went wrong.",
      });
    });
};

exports.updateNote = (req, res, next) => {
  const errors = validationResult(req);
  const { title, content, note_id } = req.body;
  const image = req.file;

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation Failed",
      errorMessages: errors.array(),
    });
  }

  Note.findById(note_id)
    .then((note) => {
      if(note.creator.toString() !== req.userId) {
        return res.status(401).json("Auth Failed")
      }
      note.title = title;
      note.content = content;
      if (note.cover_image) {
        fileDel(note.cover_image);
        note.cover_image = image.path;
      } else if (image && !note.cover_image) {
        note.cover_image = image.path;
      }
      return note.save();
    })
    .then(() => {
      return res.status(200).json({
        message: "Post was successfully updated",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Something went wrong.",
      });
    });
};
