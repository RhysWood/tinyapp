const express = require("express");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');
const { generateRandomString, fetchEmailById, findUserByEmail, urlsForUser } = require('./helpers');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {};

app.get("/urls", (req, res) => {
  const userEmail = fetchEmailById(req.session.user_id, users);
  const userURLS = urlsForUser(req.session.user_id, urlDatabase);
  const templateVars = {
    userURLS,
    userEmail
  };
  if (!req.session.user_id){
    return res.redirect('/login');
  }
  res.render('urls_index.ejs', templateVars);
});

app.get("/urls/new", (req, res) => {
  const userEmail = fetchEmailById(req.session.user_id, users)
  const templateVars = {userEmail};
  if (!req.session.user_id){
    return res.redirect('/login');
  }
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; 
  const userURLS = urlsForUser(req.session.user_id, urlDatabase)
  if (!userURLS[shortURL]){ //if the short URL is not in the database
    return res.status(404).send('URL not Found! You may need to log in to view this') //return 404 status and redirect to 404 error page
  }
  const longURL = urlDatabase[shortURL].longURL;
  const userEmail = fetchEmailById(req.session.user_id, users)
  const templateVars = {shortURL, longURL, userEmail}
  res.render("urls_show.ejs", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  if (!urlDatabase[shortURL]){ //if the short URL is not in the database
    return res.status(404).send('URL not Found!') //return 404 status and redirect to 404 error page
  }
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get("/u/urls_404", (req, res) => {
  const userEmail = fetchEmailById(req.session.user_id, users)
  const templateVars = {userEmail};;
  res.render("urls_404.ejs", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/login", (req, res) => {
  const userEmail = fetchEmailById(req.session.user_id, users);
  const templateVars = {userEmail};
  res.render("login", templateVars)
});

app.get("/register", (req, res) => {
  const userEmail = fetchEmailById(req.session.user_id, users)
  const templateVars = {userEmail};;
  res.render("register.ejs", templateVars)
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); 
  urlDatabase[shortURL] = {"longURL": req.body.longURL, "userID": req.session.user_id }; //create new database key Value randomString : longUrl
  res.redirect(`/urls/${shortURL}`); //redirects to /urls/shortURL
});

app.post("/urls/:id/edit", (req, res) => {
  const userURLS = urlsForUser(req.session.user_id, urlDatabase)
  const urlID = req.params.id; 
  if (!userURLS[urlID]){ //if the short URL is not in the database
    return res.status(404).send('URL not Found! You may need to log in to view this') //return 404 status and redirect to 404 error page
  }
  urlDatabase[urlID].longURL = req.body.editURL; 
  res.redirect('/urls') //redirect back to urls page
})

app.post("/urls/:id/delete", (req, res) => {
  const userURLS = urlsForUser(req.session.user_id, urlDatabase)
  const urlID = req.params.id; //urlID is the id shown in the url 
  if (!userURLS[urlID]){ //if the short URL is not in the database
    return res.status(404).send('URL not Found! You may need to log in to view this') //return 404 status and redirect to 404 error page
  }
  delete urlDatabase[urlID]; //delete this url from database
  res.redirect('/urls') //redirect back to urls page
})

app.post("/logout", (req, res) => {
  res.clearCookie('session');
  res.redirect('/login') //redirect back to urls page
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = findUserByEmail(email, users);
  if (!email || !password) {
    return res.status(403).send('email and password cannot be blank.');
  }
  if (user === null || !user) {
    return res.status(403).send('no user with that email found. Remember to register first!');
  }
  const hashedPassword = user.password
  const access = bcrypt.compareSync(password, hashedPassword);
  // validate input
  if (!access) {
    return res.status(403).send('password does not match.');
  }
  //happy path
  req.session.user_id = user.id;
  res.redirect('/urls') //redirect back to urls page
});

app.post("/register", (req, res) => {
  const ID = generateRandomString(); 
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!email || !password){
    return res.status(404).send('incorrect password!')
  }
  for (let key in users){
    if (users[key].email === email){
      return res.status(404).send('This user already exists!')
    }
  }
  req.session.user_id = ID;
  users[ID] = {
    "id": ID,
    "email": email,
    "password": hashedPassword
  }
  res.redirect("/urls");
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`tinyApp Server listening on port ${PORT}!`);
});