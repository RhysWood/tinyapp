const generateRandomString = () => {
  return Math.random().toString(36).substring(6) //creates a random 6 letters/numbers
};

const fetchEmailById = (id, users) =>{
  const user = users[id];
  const userEmail = user && user.email;
  return userEmail;
};

const findUserByEmail = (email, users) => {
  for (const userId in users) {
    const user = users[userId]; 
    if (user.email === email) {
      return user
    }
  }
  return undefined;
}

const urlsForUser = (id, urlDatabase) => {
  let output = {};
  for (const keys in urlDatabase){
    if (urlDatabase[keys].userID === id){
      output[keys]={...urlDatabase[keys]};
    }
  }
  return output;
};


module.exports = {
  generateRandomString,
  findUserByEmail,
  fetchEmailById,
  urlsForUser
};
