# LinkUp

LinkUp is a social application built with Express and MongoDB. The server exposes account, authentication, profile, social-graph, post, reaction, and comment APIs.

## Run the server

Install the backend dependencies:

```bash
npm ci --prefix server
```

Copy `server/.env.example` to `server/.env`. Generate a JWT secret:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Set `JWT_SECRET`, `LINKUP_DB_URI`, and `LINKUP_NS` in `server/.env`. `LINKUP_DB_URI` should contain the MongoDB Atlas connection string, while `LINKUP_NS` names the database containing the LinkUp collections. No local MongoDB service is required.

Start the development server:

```bash
npm run server:dev
```

The API listens on port `5000` by default. `GET /health` reports whether the process remains connected to MongoDB.

## Render deployment

The repository includes a `render.yaml` Blueprint. Render installs the locked dependencies with `npm ci`, starts the API with `npm start`, and checks `/health`. During initial Blueprint creation, provide `LINKUP_DB_URI`; Render generates `JWT_SECRET` automatically.

The server scripts suppress only Node's `DEP0170` warning because the legacy MongoDB driver can include database credentials in that warning. Other warnings remain enabled.
