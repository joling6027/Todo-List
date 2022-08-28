const mongoose = require('mongoose');

const toDoListSchema = new mongoose.Schema({
  record: {type: String, required: true },
  date: {type: Number, default: Date.now}
})

const model = mongoose.model('TodoListModel', toDoListSchema);

module.exports = model;