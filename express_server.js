const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const { generateRandomString, urlsForUser, fetchEmail, urlDatabase, users } = require("./helpers");
const PORT = 8080;

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");

///////////////////////////////////////////////////////////////////////////////////////////////
// 1. GET /
app.get("/", (req, res) => {
  res.send("Hello");
}); 

//2. GET urls
app.get("/urls", (req, res) => {

  const user = users[req.session.user_id] ? users[req.session.user_id].id : "";
  //const username = user ? users[req.cookies.user_id].email : ""; //login as email...
  //console.log("username:", username) //  amerimahsa@yahoo.com email that registered with
  const username = user ? users[req.session.user_id].email : "";
   if(!user){
   return res.redirect('/login')
  }
  const urlOfTheUsers = urlsForUser(user);
  const templateVars = {
    //urls: urlDatabase, updated to :
    urls: urlOfTheUsers,
    //username: req.cookies["username"], updated :
    //username : user, updated :
    username
  };
  res.render('urls_index', templateVars);
});

//3. GET /urls/new ... POST: POST urls
app.get("/urls/new", (req, res) => {
  //const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  //console.log("user: ", user); //amerimahsa@yahoo.com: email that registered with
  const user = users[req.session.user_id] ? users[req.session.user_id].email : "";
  const templateVars = {
    urls: urlDatabase,
    //username: req.cookies["username"], updated:
    username : user
  };
  if (!user) {
    return res.redirect("/login");
    // or : return res.render('urls_login', templateVars)
  }
  res.render('urls_new', templateVars);
});

//4. POST urls ... GET: GET /urls/new
app.post("/urls", (req, res) => {
  //console.log("req.body", req.body); //{ longURL: 'www.facebook.com' }
  //console.log("longURL:", longURL)
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  
  //let userID = req.cookies.user_id
  let userID = req.session.user_id
  //console.log("userID:", userID)
  
  //urlDatabase[shortURL] = longURL; //creating longURL through shortURL(like push) updated:
  urlDatabase[shortURL] = {
    longURL,
    userID
  }
  res.redirect(`/urls/${shortURL}`);
});

//5. GET /urls/:shortURL
app.get("/urls/:shortURL", (req, res) => { //:id means id is route parameter and available in req.param
  //console.log("req.params", req.params); //{ shortURL: 'b2xVn2' }
  //console.log("req.params.shortURL", req.params.shortURL); //'b2xVn2'

  //const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const user = users[req.session.user_id] ? users[req.session.user_id].email : "";
  if (!user) {
    return res.redirect('/login');
  }
 
  const templateVars = {
    shortURL : req.params.shortURL , //b2xVn2
    //longURL : urlDatabase[req.params.shortURL], //http://www.lighthouselabs.ca updated:
    longURL : urlDatabase[req.params.shortURL].longURL,
    //username: req.cookies["username"], updated:
    username : user,
    urls : urlsForUser(user.id)
  };

  if (urlDatabase[req.params.shortURL] && req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    res.render('urls_show', templateVars);
  } else {
    res.status(400).send("<h1> 🛑 It Doesn't belong you! 🛑 </h1>")
  }
  
});

//6. GET Register
app.get("/register", (req, res) => {
  //const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const user = users[req.session.user_id] ? users[req.session.user_id].email : "";

  const templateVars = {
    urls: urlDatabase, 
    //username: req.cookies["username"], updated:
    username : user
  };
  res.render("urls_register", templateVars)
});

//7. POST Register
app.post("/register", (req, res) => {
  const id = generateRandomString();
  //console.log("POST REG req.body", req.body); //{ email: 'amerimahsa@yahoo.com', password: '12' }
  const email = req.body.email;
  const password = req.body.password;

  if (email.length === 0 || password.length === 0) {
    return res.status(400).send("<h1> 🛑 Email or Password is invalid! 🛑 </h1>");
  } else if (fetchEmail(users, email)) { //yani in email faghat vase ye nafare, kasi nemitoone bahash vared she
    return res.status(400).send("<h1> 🛑 Email is already in use! 🛑 </h1>");
  }
  //we only want to define a new user if none of the error conditions happen so we put conditions before newUser
  const newUser = {
    id, 
    email, 
    password: bcrypt.hashSync(password, salt) //const hashedPassword = bcrypt.hashSync(password, 10);
  };
  const key = id;
  users[key] = newUser;//add newUser to users
 
  //res.cookie('user_id', id); its func
  req.session.user_id = id; //obj
  res.redirect("/urls");
});


//8. GET Login
app.get('/login', (req, res) => {
  //const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const user = users[req.session.user_id] ? users[req.session.user_id].email : "";

  const templateVars = {
    urls: urlDatabase, 
    //username: req.cookies["username"], updated:
    username : user
  };
  res.render("urls_login", templateVars)
});

//9. POST Login
app.post('/login', (req, res) => {
  //console.log("login req.body.username", req.body.username);
  //1)res.cookie('username', req.body.username); //req.cookies["username"]
  const email = req.body.email;
  const password = req.body.password;
  const user = fetchEmail(users, email);

  if (email.length === 0 || password.length === 0) {
    return res.status(403).send("<h1> 🛑 Email or Password is invalid! 🛑 </h1>");
    //else if (!user || user.password !== password)
  } else if (!user || !bcrypt.compareSync(password, user.password)) { // hashing first one and compare it to the second
    //                                                                 bcrypt.compareSync("B4c0/\/", hash)  
    return res.status(403).send("<h1> 🛑 User or Password is NOT MATCH!!! 🛑 First Register </h1>"); 
  }

  //res.cookie('user_id', user.id); //else : user exist and password matchs
  req.session.user_id = user.id;
  res.redirect('/urls');
});

//10. POST LogOut ---> delete username
app.post('/logout', (req, res) => {
  //1)res.clearCookie("username", req.body.username); or res.clearCookie("username") only the key
  //const username = req.body.user_id;
  //res.clearCookie("user_id");
  req.session = null;
  res.redirect('/urls');
});

//11. POST Delete:
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL; //delet this would be enough because it's a key
  //delete urlDatabase[shortURL];
  //const userId = req.cookies.user_id;
  const userId = req.session.user_id;

  if (urlDatabase[shortURL] && userId === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  } else {
    res.status(403).send("<h1> 🛑 You must be logged in to DELETE URLs! 🛑 </h1>");
  }
  //res.redirect("/urls");
});

//12. POST Edit / update:
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  //const userId = req.cookies.user_id;
  const userId = req.session.user_id;

  //urlDatabase[shortURL] = longURL; //update longURL updated:
  
  if (urlDatabase[shortURL] && userId === urlDatabase[shortURL].userID) {

    urlDatabase[shortURL] = {
      longURL : longURL,
      userID : userId
    }
    res.redirect("/urls");
  } else {
    res.status(403).send("<h1> 🛑 You must be logged in to EDIT URLs! 🛑 </h1>");
  }
  //res.redirect("/urls");
});

//13. GET /u/:shortURL
app.get("/u/:shortURL", (req, res) => { //ex: http://localhost:8080/u/b2xVn2 redirect it to : http://www.lighthouselabs.ca
  //const longURL = urlDatabase[req.params.shortURL]; updated:
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL; //or["longURL"]
  res.redirect(longURL);
});

//14. GET /urls.json     //for showing obj in browser
app.get("/urls.json", (req, res) => {
  //res.json(urlDatabase);
  res.json(users);
});

//15. GET /hello
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World!</b></body></html>\n")
});

//16. APP.LISTEN
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});