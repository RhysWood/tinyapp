# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["create account"](/docs/create_account.png)
>Create an Account with email and password.

!["New URL"](/docs/newURl.png)
>Create new short URL

!["User URLs"](/docs/userURLs.png)
>List of created short URLs

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command or `npm start`.
- This server runs locally on port: 8080. Once the server is running, enter `http://localhost:8080/` into your browser to access the app.
- Register your email address and password to create an account. **NOTE: all passwords and cookies are encrypted using bcrypt, so rest easy!**
- Get making some shortened URLs! Each new URL will be shown on the  `My URLs` page, they can be edited to a new route at your discression! 