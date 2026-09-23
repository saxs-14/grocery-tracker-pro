# Grocery Tracker Pro

A real, account-based grocery spending tracker built for practical everyday use.

## What works

- Real user registration and login with JWT authentication.
- Password hashing with bcrypt.
- Private, user-scoped grocery trips and reports.
- Create and delete shopping trips.
- Add, edit and remove grocery items.
- Categories: Food, Drinks, Toiletries, Household and Other.
- Automatic trip totals calculated by the database model.
- Personal category and spending summaries.
- Responsive mobile-friendly interface.
- Production API health endpoint.
- Configurable API URL for deployment.

## Stack

- React 19 + React Router
- Express 5
- MongoDB + Mongoose
- JWT + bcryptjs
- Axios
- lucide-react

## Run locally

Create `server/.env` using `.env.example`, then run `cd server && npm install && npm start`.

Create `client/.env` with `REACT_APP_API_URL=http://localhost:5000/api`, then run `cd client && npm install && npm start`.

## Production reality

The repository contains working application code, but a real public deployment still needs configured infrastructure. No database credentials or JWT secrets belong in GitHub. Use environment variables on the hosting provider.

The application deliberately does not contain fake payment, fake store integrations, fake receipt scanning, or simulated data. Those are separate features requiring real providers and end-to-end testing.

## Data isolation

Every trip belongs to the authenticated MongoDB user. The API checks ownership before reading, changing or deleting trip data, and reports are filtered to the authenticated user.

## Legacy data

Existing trips created before user ownership became required may not be visible after this upgrade because they do not have a `userId`. They should be migrated deliberately rather than silently assigned to the wrong account.

## Project standard

This is intended to become a dependable real application, not a mockup. Changes should be tested, secrets excluded, errors handled, and functionality described honestly.
