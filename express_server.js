const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 8080;
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
function generateRandomString() { //random id
  return Math.random().toString(36).substring(2, 8);
}
///////////////////////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello");
}); 
//////////   GET & POST "/urls"

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

//////////
app.get("/urls/new", (req, res) => {
  res.render('urls_new');
});
app.post("/urls", (req, res) => {
  console.log("req.body", req.body); //{ longURL: 'www.facebook.com' }
  res.send("OK");
});

app.get("/urls/:shortURL", (req, res) => { //:id means id is route parameter and available in req.param
  //console.log("req.params", req.params); //{ shortURL: 'b2xVn2' }
  //console.log("req.params.shortURL", req.params.shortURL); //{ shortURL: 'b2xVn2' }
  const templateVars = {
    shortURL : req.params.shortURL , //b2xVn2
    longURL : urlDatabase[req.params.shortURL] //http://www.lighthouselabs.ca
  };
  res.render('urls_show', templateVars)
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World!</b></body></html>\n")
});
app.get("*", (req, res) => {
  res.statusCode(404).render("404");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});