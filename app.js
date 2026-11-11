const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());


const db = mysql.createConnection({
   host: 'localhost',
   port: 3307,
   user: 'root',
   password: '',
   database: 'szerviz_db'
});

//1.
app.get('/szolgaltatasok', (req, res) => {
   const query = `SELECT s.id, k.nev AS kategoria, s.megnevezes, s.alapar, s.munkaido_perc FROM
    szolgaltatasok s INNER JOIN kategoriak k ON s.kategoria_id = k.id;`;
   db.query(query, (err, results) => {
       if (err) {
           res.status(500).json({ hiba: "Üzenet" });
           return;
       }
       res.json(results);
   });
});

//2.
app.get('/szolgaltatasok/elerheto', (req, res) => {
    const query = `SELECT * FROM szolgaltatasok WHERE aktiv = 1 
    AND munkaido_perc <= 60;`;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ hiba: "Üzenet" });
            return;
        }
        res.json(results);
    });
 });

//3.
app.get('/szolgaltatasok/kereses/:szoveg', (req, res) => {
   const szoveg = `%${req.params.szoveg}%`;
   const query = "SELECT * FROM szolgaltatasok WHERE megnevezes LIKE CONCAT('%', ?, '%');";
   db.query(query, [szoveg], (err, results) => {
       if (err) {
           res.status(500).json({ hiba: "Üzenet" });
           return;
       }
       res.json(results);
   });
});

//4.
app.get('/kategoriak/statisztika', (req, res) => {
    const query = `SELECT k.nev AS kategoria_nev `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ hiba: "Üzenet" });
            return;
        }
        res.json(results);
    });
 });

 //5.
 app.get('/szolgaltatasok/dragak', (req, res) => {
    const query = `SELECT megnevezes, alapar, munkaido_perc FROM szolgaltatasok WHERE alapar > 25000
     ORDER BY alapar DESC;`;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ hiba: "Üzenet" });
            return;
        }
        res.json(results);
    });
 });


app.listen(3000, () => {
    console.log("A szerver fut a 3000es porton");
});