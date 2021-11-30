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

const generateRandomString = () => {
  return Math.random().toString(36).substring(6) //creates a random 6 letters/numbers
};

app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urlDatabase
  };
  res.render('urls_index.ejs', templateVars);
});

app.get("/urls/new", (req, res) => {[]
  const cookie = {username: req.cookies["username"]};
  res.render("urls_new", cookie);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); 
  urlDatabase[shortURL] = req.body.longURL; //create new database key Value randomString : longUrl
  res.redirect(`/urls/${shortURL}`); //redirects to /urls/shortURL
  console.log(urlDatabase); 
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

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; 
  const longURL = urlDatabase[shortURL];
  const templateVars = {shortURL, longURL, username: req.cookies["username"]}
  res.render("urls_show.ejs", templateVars);
});

app.get("/u/urls_404", (req, res) => {
  const cookie = {username: req.cookies["username"]};
  res.render("urls_404.ejs", cookie);
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

app.post("/login", (req, res) => {
  const username = req.body.username
  res.cookie('username', username);
  console.log('Signed Cookies: ', req.signedCookies)
  res.redirect('/urls') //redirect back to urls page
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect('/urls') //redirect back to urls page
});

app.get("/register", (req, res) => {
  const cookie = {username: req.cookies["username"]};
  res.render("register.ejs", cookie)
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`tinyApp Server listening on port ${PORT}!`);
});