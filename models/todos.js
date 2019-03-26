let mongoose = require('mongoose');


let todos = new mongoose.Schema({
    text: String,
    body: String

});

//mapping
mongoose.model('todos', todos);