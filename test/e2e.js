'use strict';

require('dotenv').config();
const {ManagementClient} = require('auth0');
const getAllUsers = require('../src/index');

const auth0 = new ManagementClient({
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN 
});

(async () => {
  const allUsers = await (getAllUsers(auth0).asArray());
  console.log(allUsers);
})();
