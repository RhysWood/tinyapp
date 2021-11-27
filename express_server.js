const express = require("express");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  return Math.random().toString(36).substring(6) //creates a random 6 letters/numbers
};

app.get("/urls", (req, res) => {
  res.render('urls_index.ejs', {urlDatabase});
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  const templateVars = {shortURL, longURL}
  res.render("urls_show.ejs", templateVars);
});

app.get("/u/urls_404", (req, res) => {
  res.render("urls_404.ejs");
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

app.get("/", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`tinyApp Server listening on port ${PORT}!`);
});