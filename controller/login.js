
const express = require('express');
const app = express();
const crypto = require('crypto')
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'mydb'
});
const session = require('express-session');
const DynamoDBStore = require('connect-dynamodb')(session)
const DynamoDBStoreOptions = {
  table: "db-session",
  AWSConfigJSON: {
    region: 'us-east-1',
    correctClockSkew: true,
    httpOption: {
      secureProtocol: 'TLSv1_method',
      ciphers: "ALL"
    },
  },
}
app.use(session({
  store: new DynamoDBStore(DynamoDBStoreOptions),
  name: 'session-name',
  secret: 'session-secret-key',
  resave: false,
  saveUninitialized: false
}));

// DB_Connect
connection.connect((err) => {
  if (err)throw err;
  console.log("database conected...");
});

app.set('view engine', 'ejs')

let i = 0;

app.post("/login", (req, res) => {
  let Id = req.body.usrname;//ID
  let Pass = req.body.passwd;//passwd
  
  if(Id === "" || Pass === ""){
    return res.render("./login.ejs",{err:'IDとパスワードを入力してください。'});
  }
  
  Pass = crypto.createHash('sha256').update(req.body.passwd).digest('hex');
  
  // DB_loading
  connection.query('SELECT * FROM user', (err, results) => {
    if (err) {
      throw err
      };
      for(i; i< results.length; i++){
        // Auch_process
        if (Id === results[i].user_id){
          if(Pass === results[i].password){
            console.log('pass_ok');
            return res.render("./next",{name:results[i].name});
          }else{
            console.log('passwd_err');
            return res.render("./login",{err:'ID、もしくはパスワードが間違っています。'});
          }
        }
      }
      console.log('usrname_err');
      return res.render("./login",{err:'ID、もしくはパスワードが間違っています。'});
    });
  }
);
      


app.get("/",(req,res) => {
  res.redirect("/login");
});

app.get("/login",(req,res) => {
  res.render("./login",{err:""});
});

module.exports = app;