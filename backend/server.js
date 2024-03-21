const express = require('express');
const cors = require('cors')
const app = express();
const port = 3001;
const mysql = require('mysql');
const connsql = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"CoffeeGodine"
});

app.use(cors({ origin: "*" }));
app.listen(port, ()=>{
    console.log('server ok');
    connsql.connect(err =>{
        if (err){console.log(err);}
        else {console.log('database ok');}
    })
})

app.get('/api/tovar',(req,res) => {

    let query = 'select * from Tovar';

    connsql.query(query,(err,result,field) => {
        res.json(result);
    })
})

app.use(express.json());

app.post('/api/loginAdmin', (req, res) => {
    let query = 'select count(*) <> 0 as res from users where id = 0 and mail = "' + req.body.mail + '" and password = "' + req.body.pass + '"';

    connsql.query(query,(err,result,field) => {
        res.json(result[0]);
    })
});

app.post('/api/deleteItem', (req, res) => {
    let query = 'select count(*) <> 0 as res from users where id = 0 and mail = "' + req.body.mail + '" and password = "' + req.body.pass + '"';
    connsql.query(query,(err,result,field) => {
        if(result[0]){
            let query1 = "DELETE FROM Tovar WHERE Tovar.id = " + req.body.id;
            connsql.query(query1)
        }
    })
});

app.post('/api/addItem', (req, res) => {
    let query = 'select count(*) <> 0 as res from users where id = 0 and mail = "' + req.body.mail + '" and password = "' + req.body.pass + '"';
    connsql.query(query,(err,result,field) => {
        if(result[0]){
            let query1 = 'SELECT MAX(id)+1 as ID FROM Tovar';
            connsql.query(query1,(err,result,field) => {
                let query2 = "INSERT INTO Tovar (id, name, opisanie, price, optprice) VALUES ('" + result[0].ID + "', '', '', '0', '0')";
                connsql.query(query2)
            })
        }
    })
});

app.post('/api/UpdateItem', (req, res) => {
    let query = 'select count(*) <> 0 as res from users where id = 0 and mail = "' + req.body.mail + '" and password = "' + req.body.pass + '"';
    connsql.query(query,(err,result,field) => {
        if(result[0]){
            let query1 = "UPDATE Tovar SET " + req.body.pole + " = '" + req.body.value + "' WHERE Tovar.id = " + req.body.id;
            connsql.query(query1)
        }
    })
});

app.post('/api/TovarUpdate', (req, res) => {
    let query = 'select price from Tovar';

    connsql.query(query,(err,result,field) => {
        res.json(result);
    })
});