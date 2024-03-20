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
    console.log(req.body);
    let query = 'select count(*) <> 0 as res from users where id = 0 and mail = "' + req.body.mail + '" and password = "' + req.body.pass + '"';

    connsql.query(query,(err,result,field) => {
        res.json(result[0]);
    })
});