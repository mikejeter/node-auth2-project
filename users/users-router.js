const router = require('express').Router();
const checkRole = require('../auth/check-role-middleware.js');

const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');

router.get('/', restricted, checkRole('STUDENT'), (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.get('/somthing', restricted, checkRole('ADMIN'), (req, res) => {
  // do the things
  res.send('yah');
});

module.exports = router;