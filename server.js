const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const app = express();



// db

mongoose.connect('mongodb://localhost/todosDb');
autoIncrement.initialize(mongoose);
var Todo;

var db = mongoose.connection;
db.once('open', function() {
    var todoSchema = mongoose.Schema({
        todoId: Number,
        text: String,
        done: Boolean,
        toDate: Date
    });

    todoSchema.plugin(autoIncrement.plugin, {
        model: 'Todo',
        field: 'todoId',
        startAt: 1
    });

    Todo = mongoose.model('Todo', todoSchema);

    // server start
    app.listen(3000, function() {
        console.log('listening on 3000');
    });
});



// CRUD

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/todos', function(req, res) {
    if (req.body.text === '' || req.body.toDate === '') {
        res.send('Invalid parameters');
        return;
    }
    var t = new Todo({
        text: req.body.text,
        done: false,
        toDate: req.body.toDate
    });
    t.save();
    res.send('Saved successfully');
});