# Basic-Auth-Service

This git contains the base for an authentication service, which can be used any way you want for the development of your app.

## Instructions

1. Install NPM packages with:
```
> npm install
```
2. Create a .env file if necessary, including the following:
```
PG_HOST=
PG_USER=
PG_PASSWORD=
PG_DATABASE=
PG_PORT=
DOMAIN=
COOKIE_SECRET=
JSON_SECRET=
```

*Note:* It uses PostgreSQL as the selected db. If needed, you can change it on /db/knexfile.js according to [Knex guide](http://knexjs.org/#Installation-client).

3. Apply migrations running the following on your terminal:
```
> cd db
> knex migrate:latest
```

*Note:* For more info on migrations, check: http://knexjs.org/#Migrations

4. You're ready to go! Start your server by running:

```
> cd npm run start
```