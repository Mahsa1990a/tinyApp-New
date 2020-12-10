const urlDatabase = {
  // "b2xVn2": "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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
};

//random id
const generateRandomString = () => { 
  let id = Math.random().toString(36).substring(2, 8);
  return id;
};

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

//helper Func: for POST Register
const fetchEmail = (dataBase, email) => {
  for (let key in dataBase) { //key -> id = userRandomID,user2RandomID,ed5f5p(vase newUser)  
    //console.log("key of 88:", key);
    //console.log("dataBase[key] of 88:", dataBase[key]);//{ id: 'mb3dt1', email: 'amerimahsa@yahoo.com', password: '123' }
    if (dataBase[key].email === email) {
      //return dataBase[key].email;
      return dataBase[key]; //{id: ..., email: ..., pass: ...}
      //return true;
    }
  } return false;
};

module.exports = { generateRandomString, urlsForUser, fetchEmail, urlDatabase, users }