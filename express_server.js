const express = require("express");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

const generateRandomString = () => {
  return Math.random().toString(36).substring(6) //creates a random 6 letters/numbers
};

const fetchEmailById = (id) =>{
  const user = users[id];
  const userEmail = user && user.email;
  return userEmail;
};

const findUserByEmail = (email, users) => {
  for (const userId in users) {
    const user = users[userId]; // users['abc']
    if (user.email === email) {
      return user
    }
  }
  return null;
}

app.get("/urls", (req, res) => {
  const userEmail = fetchEmailById(req.cookies["user_id"])
  const templateVars = {
    urlDatabase,
    userEmail
  };
  res.render('urls_index.ejs', templateVars);
});

app.get("/urls/new", (req, res) => {
  const userEmail = fetchEmailById(req.cookies["user_id"])
  const templateVars = {userEmail};
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; 
  const longURL = urlDatabase[shortURL];
  const userEmail = fetchEmailById(req.cookies["user_id"])
  const templateVars = {shortURL, longURL, userEmail}
  res.render("urls_show.ejs", templateVars);
});

app.get("/u/urls_404", (req, res) => {
  const userEmail = fetchEmailById(req.cookies["user_id"])
  const templateVars = {userEmail};;
  res.render("urls_404.ejs", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]){ //if the short URL is not in the database
    res.status(404).redirect('/u/urls_404') //return 404 status and redirect to 404 error page
  }
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/login", (req, res) => {
  const userEmail = fetchEmailById(req.cookies["user_id"])
  const templateVars = {userEmail};
  res.render("login", templateVars)
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); 
  urlDatabase[shortURL] = req.body.longURL; //create new database key Value randomString : longUrl
  res.redirect(`/urls/${shortURL}`); //redirects to /urls/shortURL
});

app.post("/urls/:id/edit", (req, res) => {
  const urlID = req.params.id; 
  urlDatabase[urlID] = req.body.editURL; 
  res.redirect('/urls') //redirect back to urls page
})

app.post("/urls/:id/delete", (req, res) => {
  const urlID = req.params.id; //urlID is the id shown in the url 
  delete urlDatabase[urlID]; //delete this url from database
  res.redirect('/urls') //redirect back to urls page
})

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/login') //redirect back to urls page
});

app.get("/register", (req, res) => {
  const userEmail = fetchEmailById(req.cookies["user_id"])
  const templateVars = {userEmail};;
  res.render("register.ejs", templateVars)
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = findUserByEmail(email, users);
  // validate input
  if (!email || !password) {
    return res.status(403).send('email and password cannot be blank.');
  }
  if (!user) {
    return res.status(403).send('no user with that email found.');
  }
  if (user.password !== password) {
    return res.status(403).send('password does not match.');
  }
  //happy path
  res.cookie('user_id', user.id)
  res.redirect('/urls') //redirect back to urls page
});

app.post("/register", (req, res) => {
  const ID = generateRandomString(); 
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password){
    return res.status(404).send('incorrect password!')
  }
  for (let key in users){
    if (users[key].email === email){
      return res.status(404).send('This user already exists!')
    }
  }
  res.cookie('user_id', ID);
  users[ID] = {
    "id": ID,
    "email": email,
    "password": password
  }
  console.log('ID :', req.signedCookies)
  res.redirect("/urls");
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`tinyApp Server listening on port ${PORT}!`);
});