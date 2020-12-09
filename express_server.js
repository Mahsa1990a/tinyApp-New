const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
const PORT = 8080;
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
function generateRandomString() { //random id
  let id = Math.random().toString(36).substring(2, 8);
  return id;
};
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// 1.
app.get("/", (req, res) => {
  res.send("Hello");
}); 

//2.
app.get("/urls", (req, res) => {
  console.log('from get urls', req.cookies["username"]);

  console.log('This is req.cookies ', req.cookies);
  console.log('This is req.cookies.user_id ', req.cookies.user_id); //it's user_id
  //console.log('This is users[req.cookies.user_id] ', users[req.cookies.user_id]);
  //const user = users[req.cookies.user_id];
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const templateVars = {
    urls: urlDatabase, 
    //username: req.cookies["username"],
    username : user
  };
  res.render('urls_index', templateVars);
});

// app.get('/urls', (req, res) => {
//   const userID = req.cookies['user_id'];
//   const templateVars = {
//     urls: urlDatabase,
//     user: users[userID]
//   };
//   res.render('urls_index', templateVars);
// });

//3.
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const templateVars = {
    urls: urlDatabase,
    //username: req.cookies["username"],
    username : user
  };
  res.render('urls_new', templateVars);
});

//3.1 GET Register
app.get("/register", (req, res) => {
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const templateVars = {
    urls: urlDatabase, 
    //username: req.cookies["username"],
    username : user
  };
  res.render("urls_register", templateVars)
});

//helper Func:
const fetchEmail = (dataBase, email) => {
  for (let key in dataBase) { //key -> id = userRandomID,user2RandomID,ed5f5p  
    console.log("key of 88:", key);
    console.log("dataBase[key] of 88:", dataBase[key]);//{ id: 'mb3dt1', email: 'amerimahsa@yahoo.com', password: '123' }
    if (dataBase[key].email === email) {
      return dataBase[key].email;
      //return true;
    }
  } return false;
};

//3.2 POST Register
app.post("/register", (req, res) => {
  const id = generateRandomString();
  //console.log("POST REG id", id);
  console.log("POST REG req.body", req.body); //{ email: 'amerimahsa@yahoo.com', password: '12' }
  const email = req.body.email;
  const password = req.body.password;

  //conditions:
  if (email.length === 0 || password.length === 0) {
    return res.status(400).send("🛑 Email or Password is invalid! 🛑");
  } else if (fetchEmail(users, email)) {
    return res.status(400).send("🛑 Email is already in use! 🛑");
  }
  
  const newUser = { //add newUser to users
    id, 
    email, 
    password
  };
  const key = id;
  users[key] = newUser;//add newUser to users
 
  res.cookie('user_id', id);
  res.redirect("/urls");
});

//4.
app.get("/urls/:shortURL", (req, res) => { //:id means id is route parameter and available in req.param
  //console.log("req.params", req.params); //{ shortURL: 'b2xVn2' }
  //console.log("req.params.shortURL", req.params.shortURL); //{ shortURL: 'b2xVn2' }
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const templateVars = {
    shortURL : req.params.shortURL , //b2xVn2
    longURL : urlDatabase[req.params.shortURL], //http://www.lighthouselabs.ca
    //username: req.cookies["username"],
    username : user
  };
  res.render('urls_show', templateVars)
});

//4.1
app.post('/login', (req, res) => {
  //console.log("login req.body.username", req.body.username);

  res.cookie("user", req.cookies.user_id);
  //res.cookie("user", req.body.user);

  //res.cookie('user_id', user_id)
  //res.cookie('username', req.body.username);
  //console.log('from post login', req.cookies["username"]); //doesnt show because async
  res.redirect('/urls');
});

//4.2 delete username
app.post('/logout', (req, res) => {
  //res.clearCookie("user", req.cookies.user_id);
  const username = req.body.user_id
  res.clearCookie("user_id");
  //res.clearCookie("username", req.body.username);
  // or res.clearCookie("username") only the key
  res.redirect('/urls');
});

//5.
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

//6. delete:
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL; //delet this would be enough because it's a key
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//7. edit:
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log("edit shortURL", shortURL);
  const longURL = req.body.longURL;
  console.log("edit longURL", longURL);
  console.log("edit urlDatabase[shortURL]", urlDatabase[shortURL]);
  urlDatabase[shortURL] = longURL; //update longURL

  res.redirect("/urls");
});

//8.
app.get("/u/:shortURL", (req, res) => { //ex: http://localhost:8080/u/b2xVn2 redirect it to : http://www.lighthouselabs.ca
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//9.
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//10.
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World!</b></body></html>\n")
});

//11.
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});