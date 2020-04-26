const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {

        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!`,
          jwt_token: token
        });
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/logout", (req, res) => {
    req.secret.destroy((err) => {
        if (err) {
            res.send("unable to logout");
        } else {
            res.send("logged out");
        }
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.name,
    roles: ['ADMIN','STUDENT']
  };

  const secret = secrets.jwt_secret;

  const options = {
    expiresIn: '30 min'
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;