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
  let id = Math.random().toString(36).substring(2, 8);
  return id;
}
///////////////////////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello");
}); 
////////// 

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

app.post("/urls", (req, res) => { //urls/new
  //console.log(urlDatabase); I can see because it is a global
  //console.log("req.body", req.body); //{ longURL: 'www.facebook.com' }
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  console.log("longURL", longURL);
  console.log("shortURL", shortURL);
  urlDatabase[shortURL] = longURL; //creating longURL through shortURL(like push)
 
  res.redirect(`/urls/${shortURL}`);
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

//delete:
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL; //delet this would be enough because it's a key
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//edit:
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log("edit shortURL", shortURL);
  const longURL = req.body.longURL;
  console.log("edit longURL", longURL);

  urlDatabase[shortURL] = longURL; //update longURL

  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => { //ex: http://localhost:8080/u/b2xVn2 redirect it to : http://www.lighthouselabs.ca
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World!</b></body></html>\n")
});
// app.get("*", (req, res) => {
//   res.statusCode(404).render("404");
// });
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});