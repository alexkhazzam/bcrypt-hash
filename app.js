const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const app = express();

dotenv.config({ path: dotenv.config.env });

const fetchPasswords = (cb) => {
  const passwords = fs.readFile(
    path.join(path.dirname(process.mainModule.filename), 'password.json'),
    (err, data) => {
      err ? cb(err) : null;
      data ? cb(JSON.parse(data)) : null;
    }
  );
};

fetchPasswords((data) => {
  bcrypt.hash(data[0].password, 10, (err, hash) => {
    compareHash({ [data[0].email]: `email`, [hash]: `hash` })
      .then((result) => {
        console.log(`
        status: ${result.status}
        hash: ${result.hash}
        `);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

const compareHash = (userObj) => {
  const email = 'akhazzam1@student.gn.k12.ny.us';
  if (Object.keys(userObj)[0] === email) {
    const promise = new Promise((resolve, reject) => {
      bcrypt.compare('alexkhazzam', Object.keys(userObj)[1], (err, res) => {
        if (res) {
          resolve({
            status: true,
            hash: Object.keys(userObj)[1],
          });
        } else {
          reject(false);
        }
      });
    });
    return promise;
  }
};

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
  console.log(`Listening to requests on port ${PORT}`);
});
