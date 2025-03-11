## Diagnostic Test Results Management Application


This project is a simple CRUD application designed to help medical laboratories efficiently manage diagnostic test results. Built with Next.js, TypeScript, Prisma ORM, and Neon PostgreSQL, it provides a user-friendly interface for adding, viewing, editing, and deleting test results.

### Features

- Add New Test Results: Laboratories can input new diagnostic test data.
- View Test Results: Display all test results in a list format.
- Edit Test Results: Update existing test information.
- Delete Test Results: Remove test results from the database.

### Technology Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js API Routes, TypeScript, Prisma ORM
- Database: PostgreSQL (hosted on Neon)

### Setup Instructions

- Clone the Repository
* bash:
git clone git@github.com:Bright-Anyawe/diagnostic-tests.git
cd diagnostic-tests


- Install Dependencies: npm install

- Configure Environment Variables: 
DATABASE_URL=postgresql://username:password@hostname:port/database

- Initialize Prisma:
* bash
npx prisma generate
npx prisma migrate deploy

- Run the Application locally : npm run dev

#### API Endpoints

- Create a Diagnostic Test Result: POST /api/tests
- Get a Test Result by ID: GET /api/tests/:id
- Update a Test Result: PUT /api/tests/:id
- Delete a Test Result: DELETE /api/tests/:id
- List All Test Results: GET /api/tests

## Validation

Data validation is implemented using the Zod library to ensure proper data is sent to the endpoints.

### Deployment
The application is deployed on Vercel. You can access it at https://your-app.vercel.app.

