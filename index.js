const express = require('express');
const app = express();
const body = require('body-parser');
const { Pool } = require('pg');
const http = require('http').Server(app);
const cors = require('cors')
app.use(express.static('public'));
app.use(body.urlencoded({ extended: false }));
app.use(body.json());
app.use(cors({
    origin: "*"
}));
var connectionstr = process.env.DATABASE_URL;
var pool;
if (connectionstr) {
    pool = new Pool({
        connectionString: connectionstr,
        ssl: { rejectUnauthorized: false },
    });
} else {
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        port: 5432,
        password: 'mthobisi',
        database: 'users',
        ssl: false,
    });
}

app.get('/getusers', async(req, res) => {
    var data = (await pool.query('select username from myusers')).rows;
    res.json(data);
});
app.get('/getages', async(req, res) => {
    var data = (await pool.query('select age from myusers')).rows;
    res.json(data);
});
app.get('/', async(req, res) => {
    var data = (await pool.query('select * from myusers')).rows;
    res.json(data);
});
app.get('/user/:name/age/:age', async(req, res) => {
    var name = req.params.name;
    var age = req.params.age;
    await pool.query('insert into myusers (username, age) values($1, $2)', [name, age]);
    res.json({ 'done': 'done' });
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
    console.log('Server started on ' + PORT);
});