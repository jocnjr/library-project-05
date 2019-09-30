const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: { type: String, required: true },
  lastName: String,
  nationality: String,
  birthday: Date,
  pictureUrl: String
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
