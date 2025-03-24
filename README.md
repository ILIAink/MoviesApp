### Setting up `.env` file

In the root directory, add a file with the name `.env`, as follows:
│── backend/
│── frontend/
│── .gitignore
│── README.md
│── .env

Populate the `.env` file as follows:

```bash
DB_USER="DB_USER"
DB_PASS="DB_PASS"
DB_HOST="DB_HOST"
DB_NAME="DB_NAME"
DB_PORT=5432
```

To find the values for `DB_USER`, `DB_PASS`, `DB_HOST` and `DB_NAME`, check the pinned messages in our discord group.

### Backend

To understand the folder structure, read the following in order:

#### ./backend/controllers

#### ./backend/routes

#### ./backend/server.js

#### ./backend/db

Has two files:

- `index.js`
  - This file connects to our database by passing in the credentials stored in the `.env` file. It returns a `pool` function which we can use to query the database throughout the codebase.
- `queries.js`
  - As the name suggests, you create all the queries for the app here.
  - Ensure that all the functions are asynchronous using the `async` keyword. To learn more about [Async, Await, and Promises...](https://www.geeksforgeeks.org/difference-between-promise-and-async-await-in-node-js/)
