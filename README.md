# TransitOps

TransitOps is a Fleet Management System developed during the **Odoo Hackathon**. The application is designed to streamline fleet operations by providing a centralized platform for managing vehicles, drivers, trips, maintenance, fuel logs, and expenses through secure role-based access.

## Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- Vehicle Management
- Driver Management
- Trip Management
- Maintenance Management
- Fuel Log Management
- Expense Management
- RESTful API Architecture
- PostgreSQL Database Integration
- Input Validation
- Secure Password Hashing
- Modular Backend Structure

## Roles

- Fleet Manager
- Driver
- Safety Officer
- Financial Analyst

## Tech Stack

### Frontend
- React.js
- JavaScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt
- Express Validator

### Tools
- Git
- GitHub
- Postman
- pgAdmin

## Project Structure

```
TransitOps
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── validations
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── database
│   │   ├── schema.sql
│   │   └── seed.sql
│   │
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/<username>/TransitOps.git
```

```bash
cd TransitOps
```

---

## Backend Setup

```bash
cd server
```

Install dependencies

```bash
npm install
```

Create a `.env` file using `.env.example`

Example

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=transitops
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=2h
```

Run the database schema

```sql
database/schema.sql
```

Run seed data

```sql
database/seed.sql
```

Start backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
```

Install dependencies

```bash
npm install
```

Start frontend

```bash
npm run dev
```

---

## API Modules

### Authentication

- Register
- Login

### Vehicles

- Create Vehicle
- Get Vehicles
- Get Vehicle by ID
- Update Vehicle
- Delete Vehicle

### Drivers

- Create Driver
- Get Drivers
- Get Driver by ID
- Update Driver
- Delete Driver

### Trips

- Create Trip
- Dispatch Trip
- Complete Trip
- Update Trip
- Cancel Trip

### Maintenance

- Create Maintenance
- Update Maintenance
- Complete Maintenance

### Fuel Logs

- Create Fuel Log
- Update Fuel Log
- Delete Fuel Log

### Expenses

- Create Expense
- Update Expense
- Delete Expense

---

## Authentication

Authentication is implemented using **JWT (JSON Web Tokens)**.

Protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Role-Based Access

| Role | Permissions |
|------|-------------|
| Fleet Manager | Vehicles, Drivers, Trips |
| Driver | View assigned resources |
| Safety Officer | Maintenance |
| Financial Analyst | Fuel Logs, Expenses |

---

## Database

The project uses **PostgreSQL**.

Database includes:

- Roles
- Users
- Vehicles
- Drivers
- Trips
- Maintenance Logs
- Fuel Logs
- Expenses

---

## Backend Highlights

- RESTful API Design
- JWT Authentication
- RBAC
- PostgreSQL Integration
- Express Validator
- Password Hashing using bcrypt
- Database Transactions
- Modular Architecture
- Error Handling
- Secure API Endpoints

---

## Future Improvements

- Dashboard Analytics
- Live Vehicle Tracking
- Notifications
- Report Generation
- Email Alerts
- File Upload Support

---

## Team

Developed as part of the **Odoo Hackathon**.
