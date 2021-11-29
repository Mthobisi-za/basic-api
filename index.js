const express = require('express');
const app = express();
const body = require('body-parser');
const { Pool } = require('pg');
app.use(express.static('public'));
app.use(body.urlencoded({ extended: false }));
app.use(body.json());
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
    res.send(data);
});
app.get('/getages', async(req, res) => {
    var data = (await pool.query('select age from myusers')).rows;
    res.send(data);
});
app.get('/', async(req, res) => {
    var data = (await pool.query('select * from myusers')).rows;
    res.send(data);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server started on ' + PORT);
});