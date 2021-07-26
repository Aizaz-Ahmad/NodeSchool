<h1>NodeSchool</h1>
<p>It is a Server Side Rendered Website developed in Node.js with MongoDB as a database. The Application is structured following MVC pattern. I developed this Application to practice Node, Express.js, and MongoDB. In this Application the main focus was on backend</p>
<h2>📼 Demo</h2>
<hr />
Test this Application out by going to the link: <a href='http://nodeschool0.herokuapp.com/'>http://nodeschool0.herokuapp.com/</a>
<h3>OR</h3>
<p>Check out this Video</p>

[![NODESCHOOL-DEMO](https://adrotog-yt-embed.herokuapp.com/embed?v=II6-Nn34Gaw)](https://www.youtube.com/watch?v=II6-Nn34Gaw)

<h2>🧰 Technologies Used</h2>
<hr />
<ul>
    <li>HTML, CSS, JS</li>
    <li>BootStrap</li>
    <li>Handlebars</li>
    <li>Node.js with Express.js</li>
    <li>MongoDB</li>
</ul>

<h2>Modules Covered</h2>

```js
  {
    "bcrypt": "^5.0.1", // For hashing the password before saving to DB
    "connect-mongodb-session": "^2.4.1", // For using MongoDB as a store to save session data
    "dotenv": "^10.0.0", // For using environmental variables from a .env file using process.env
    "express": "^4.17.1", // For Setting up the server
    "express-fileupload": "^1.2.1", // For saving images that users uploaded while filling out the application
    "express-handlebars": "^5.3.2", // For using Handlebars with Express.js
    "express-session": "^1.17.2", // For mantaining sessions and storing session's data
    "mongodb": "^4.0.0", // MongoDB Node.js Driver for connecting, sending queries and retreiving result.
    "nodemailer": "^6.6.3" // For sending Email with verification Code to the Email Address of the user
  }
```

<h2>🧑‍💻 Devlopment Setup</h2>
<hr />
<p>To run this website locally</p>
<ol style="list-style-position:inside; padding-left:0px;line-height:1.7;">
<li> Clone this repository or simply download code <a href="https://github.com/Aizaz-Ahmad/NodeSchool/archive/refs/heads/main.zip">ZIP folder</a>. To clone this repo use the following command. 
<br />
<br />

```bash
    https://github.com/Aizaz-Ahmad/NodeSchool.git
```
</li>
<li><mark>npm install</mark> to install all required Node Modules</li>
<li>Inside your MongoDB Atlas Cluster, Create a new Database with the name of 'node_school'. After this import the data into the Collections by using JSON files inside data folder.</li>
<li>For using Emailing Functioanlity replace your Gmail and Password with Placeholder values inside MailUtility.js!</li>
</ol>
<h2 style="text-align:center;">If you liked the repo then Give it a star ⭐
