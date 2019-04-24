# Auth0 Get All Users

## Purpose

Auth0's users API v3 has a limitation of 1000 users per query ([source](https://auth0.com/docs/users/search/v3/get-users-endpoint#limitations)).
This module allows you to get all the users and manage them in your program.

## Usage

First, you need to install it with `npm i auth0-get-all-users`. Then:

```javascript
const {ManagementClient} = require('auth0');
const getAllUsers = require('auth0-get-all-users');

const auth0 = new ManagementClient({
  // initialize management client with your credentials
});

const allUsers = await getAllUsers(auth0).asArray(/* export job options, manager options */);
```
`asArray` takes two parameters, both are optional.

First one contains options that are the same as [user export job options](http://auth0.github.io/node-auth0/module-management.JobsManager.html#exportUsers).

Second one specifies export job manager behavior, specifically:
```javascript
{
  checkInterval: number, // time in ms, specifies how often should we check in Auth0 if export job is completed, default is 1000
  checkRetries: number // maximum amount of retries the aforementioned check is performed, default is 30
}
```

## How does it work?

Basically it creates [user export](https://auth0.com/docs/users/guides/bulk-user-exports) job, downloads the results,
uzips them, parses them as JSON and returns them to you.
