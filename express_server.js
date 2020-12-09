const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
const PORT = 8080;
app.set("view engine", "ejs");

const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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
// 1. GET /
app.get("/", (req, res) => {
  res.send("Hello");
}); 

//helper Function
const urlsForUser = (id) => {
  let urlsOfUsers = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      urlsOfUsers[key] = urlDatabase[key];
    }
  }
  return urlsOfUsers;
};

//2. GET urls
app.get("/urls", (req, res) => {
  //console.log('from get urls', req.cookies["username"]);

  //console.log('This is req.cookies ', req.cookies);
  //console.log('This is req.cookies.user_id ', req.cookies.user_id); //it's user_id
  //console.log('This is users[req.cookies.user_id] ', users[req.cookies.user_id]);

  // const user = users[req.cookies.user_id];
  // if (user) {
  //   console.log(users[req.cookies.user_id].email);
  // } else {
  //   console.log("");
  // } I did this :
  //const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].id : "";
  const username = user ? users[req.cookies.user_id].email : "";
  const urlOfTheUsers = urlsForUser(user);
  const templateVars = {
    //urls: urlDatabase, updated to :
    urls: urlOfTheUsers,
    //username: req.cookies["username"], updated :
    //username : user updated :
    username
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

//3. GET /urls/new ... POST: POST urls
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const templateVars = {
    urls: urlDatabase,
    //username: req.cookies["username"],
    username : user
  };
  if (!user) {
    return res.redirect("/login");
    // or : return res.render('urls_login', templateVars)
  }
  res.render('urls_new', templateVars);
});

//3. POST urls
app.post("/urls", (req, res) => { //urls/new
  //console.log(urlDatabase); I can see because it is a global
  //console.log("req.body", req.body); //{ longURL: 'www.facebook.com' }
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  console.log("line 92 longURL:", longURL)
  let userID = req.cookies.user_id
  console.log("line 94 userID:", userID)
  
  //urlDatabase[shortURL] = longURL; //creating longURL through shortURL(like push)
  urlDatabase[shortURL] = {
    longURL,
    userID
  }
  res.redirect(`/urls/${shortURL}`);
});

//4. GET /urls/:shortURL
app.get("/urls/:shortURL", (req, res) => { //:id means id is route parameter and available in req.param
  //console.log("req.params", req.params); //{ shortURL: 'b2xVn2' }
  //console.log("req.params.shortURL", req.params.shortURL); //{ shortURL: 'b2xVn2' }
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const templateVars = {
    shortURL : req.params.shortURL , //b2xVn2
    //longURL : urlDatabase[req.params.shortURL], //http://www.lighthouselabs.ca
    longURL : urlDatabase[req.params.shortURL].longURL,
    //username: req.cookies["username"],
    username : user
  };
  res.render('urls_show', templateVars)
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

//helper Func: for POST Register
const fetchEmail = (dataBase, email) => {
  for (let key in dataBase) { //key -> id = userRandomID,user2RandomID,ed5f5p  
    //console.log("key of 88:", key);
    //console.log("dataBase[key] of 88:", dataBase[key]);//{ id: 'mb3dt1', email: 'amerimahsa@yahoo.com', password: '123' }
    if (dataBase[key].email === email) {
      //return dataBase[key].email;
      return dataBase[key];
      //return true;
    }
  } return false;
};

//3.2 POST Register
app.post("/register", (req, res) => {
  const id = generateRandomString();
  //console.log("POST REG req.body", req.body); //{ email: 'amerimahsa@yahoo.com', password: '12' }
  const email = req.body.email;
  const password = req.body.password;

  //conditions:
  if (email.length === 0 || password.length === 0) {
    return res.status(400).send("<h1> 🛑 Email or Password is invalid! 🛑 </h1>");
  } else if (fetchEmail(users, email)) {
    return res.status(400).send("<h1> 🛑 Email is already in use! 🛑 </h1>");
  }
  //we only want to define a new user if none of the error conditions happen so we put conditions before newUser
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


//4.1 GET Login
app.get('/login', (req, res) => {
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const templateVars = {
    urls: urlDatabase, 
    //username: req.cookies["username"],
    username : user
  };
  res.render("urls_login", templateVars)
});

//4.2 POST Login
app.post('/login', (req, res) => {
  //console.log("login req.body.username", req.body.username);
  //1)res.cookie('username', req.body.username); //req.cookies["username"]
  const email = req.body.email;
  const password = req.body.password;
  const user = fetchEmail(users, email);
  if (email.length === 0 || password.length === 0) {
    return res.status(403).send("<h1> 🛑 Email or Password is invalid! 🛑 </h1>");
  } else if (!user || user.password !== password) {
    return res.status(403).send("<h1> 🛑 User or Password is NOT MATCH!!! 🛑 First Register </h1>"); 
  }
  res.cookie('user_id', user.id); //else : user exist and password matchs
  res.redirect('/urls');
    //res.cookie("user", req.cookies.user_id);
  //res.cookie("user", req.body.user);
  //console.log('from post login', req.cookies["username"]); //doesnt show because async
});

//4.3 POST LogOut ---> delete username
app.post('/logout', (req, res) => {
  //1)res.clearCookie("username", req.body.username); or res.clearCookie("username") only the key

  const username = req.body.user_id;
  res.clearCookie("user_id");
  res.redirect('/urls');
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
  //console.log("edit shortURL", shortURL);
  const longURL = req.body.longURL;
  const userID = req.cookies.user_id;
  //console.log("edit longURL", longURL);
  //console.log("edit urlDatabase[shortURL]", urlDatabase[shortURL]);
  //urlDatabase[shortURL] = longURL; //update longURL
  urlDatabase[shortURL] = {
    longURL,
    userID
  }
  res.redirect("/urls");
});

//8. GET /u/:shortURL
app.get("/u/:shortURL", (req, res) => { //ex: http://localhost:8080/u/b2xVn2 redirect it to : http://www.lighthouselabs.ca
  //const longURL = urlDatabase[req.params.shortURL];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL; //["longURL"]
  res.redirect(longURL);
});

//9. GET /urls.json
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//10. GET /hello
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World!</b></body></html>\n")
});

//11. APP.LISTEN
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});