### Getting started

1.  Set up `.env` file
2.  Go to `./frontend` directory and type `npm install`
    - This will install all the required dependencies for the frontend, if you'd like to look at what they are they are under `frontend\package.json`. Look at both fields `dependencies` and `devDependencies`
    - Then run `npm run dev`, this will boot up the website.
3.  Go to `./backend` directory and type `npm install`
    - This will install all the required dependencies for the frontend, if you'd like to look at what they are they are under `backend\package.json`. Look at both fields `dependencies` and `devDependencies`
    - Then run `npm start`, this will boot up the server.


Note:
- Both the frontend and backend need to be running at the same time for things to work properly. So have two different terminals, one running the frontend `npm run dev` and the other running the backend `npm start`. 

### Setting up `.env` file

In the root directory, add a file with the name `.env`, as follows:

```
│── backend/
│── frontend/
│── .gitignore
│── README.md
│── .env
```

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

#### `./backend/controllers`
- Handles the logic for processing requests and interacting with the database.
#### `./backend/routes`
- Defines the API endpoints and links them to the appropriate controllers.
#### `./backend/server.js`
- The entry point that initializes the server, sets up middleware, and connects routes.
#### `./backend/db`

Has two files:

- `index.js`
  - This file connects to our database by passing in the credentials stored in the `.env` file. It returns a `pool` function which we can use to query the database throughout the codebase.
- `queries.js`
  - As the name suggests, you create all the queries for the app here.
  - Ensure that all the functions are asynchronous using the `async` keyword. To learn more about [Async, Await, and Promises...](https://www.geeksforgeeks.org/difference-between-promise-and-async-await-in-node-js/)
