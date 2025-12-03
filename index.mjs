import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({ extended: true }));

//setting up database connection pool
const pool = mysql.createPool({
    host: "yhrz9vns005e0734.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "xavr1nbglty65ybz",
    password: "ymuw3zp1w66gt40q",
    database: "s1rgnvg5za0kgrsf",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
    let sqlAuthors = `SELECT authorId, firstName, lastName
            FROM q_authors
            ORDER BY lastName;`;
    let sqlCategories = `SELECT DISTINCT category
            FROM q_quotes
            ORDER BY category;`;
    let sqlLikes = `SELECT likes, quote
            FROM q_quotes
            ORDER BY likes;`;
    const [likes] = await pool.query(sqlLikes);
    console.log([likes]);
    const [authors] = await pool.query(sqlAuthors);
    const [categories] = await pool.query(sqlCategories);
    res.render("index", {authors, categories, likes});
});

app.get('/searchByKeyword', async (req, res) => {
    let userKeyword = req.query.keyword;
    let sql = `SELECT authorId, firstName, lastName, quote, likes
            FROM q_quotes
            NATURAL JOIN q_authors
            WHERE quote LIKE ?;`;
    let sqlParams = [`%${userKeyword}%`]
    const [rows] = await pool.query(sql, sqlParams);
    console.log(userKeyword);
    res.render("results", {"quotes":rows});
});

app.get('/searchByAuthor', async (req, res) => {
    let userAuthorId = req.query.authorId;
    let sql = `SELECT authorId, firstName, lastName, quote, likes
            FROM q_quotes
            NATURAL JOIN q_authors
            WHERE authorId = ?;`;
    let sqlParams = [userAuthorId];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes":rows});
});

app.get('/searchByCategory', async (req, res) => {
    let categoryQ = req.query.category;
    let sql = `SELECT authorId, firstName, lastName, quote, likes
            FROM q_quotes
            NATURAL JOIN q_authors
            WHERE category = ?
            ORDER BY quote;`;
    let sqlParams = [categoryQ];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes":rows});
});

app.get('/searchByLikes', async (req, res) => {
    let minLikes = req.query.minLikes;
    let maxLikes = req.query.maxLikes;
    let sql = `SELECT likes, authorId, firstName, lastName, quote, likes
            FROM q_quotes
            NATURAL JOIN q_authors
            WHERE likes BETWEEN ? AND ?
            ORDER BY likes;`;
    let sqlParams = [minLikes, maxLikes];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes":rows});
})

app.get('/api/author/:id', async (req, res) => {
    let authorId = req.params.id;
    let sql = `SELECT *
            FROM q_authors
            WHERE authorId = ?;`;
    const [rows] = await pool.query(sql, [authorId]);
    res.send(rows);
});

app.get("/dbTest", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});