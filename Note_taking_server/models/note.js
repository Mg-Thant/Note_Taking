const { model, Schema, SchemaType } = require("mongoose");

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    content: {
      type: String,
      required: true,
      minLength: 5,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cover_image: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Note", noteSchema);
