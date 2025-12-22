# Employee Management System

## Table of Contents
1. [Implementation Details](#implementation--details)
2. [Setup & Installation](#setup--installation)
3. [Task Completion Checklist](#task-completion-checklist)
4. [API Documentation](#api-documentation)
---


## Implementation Details
- **Frontend:** Built using **Next.js** with **Tailwind CSS** for styling.
- **Backend:** Implemented with **Django REST Framework (DRF)** to provide RESTful API endpoints.
- **Authentication & Authorization:** User authentication is managed using **JWT (JSON Web Tokens)**. Role-based access control is implemented to restrict actions based on user roles (admin, manager, employee).  
- **Database:** Uses **SQLite** for simplicity, making it easy to test and run locally. 

---

## Setup & Installation
### Installation Steps
1. Clone the repository:  
   ```bash
   git clone https://github.com/11Jou/employee-management-systema-app.git
   cd employee-management-systema-app
2. run docker-compose up --build
3. Open in broswer : http://localhost:3000/

---

## Task Completion Checklist
### Backend
- Company API : GET: Retrieve a single company or list all companies
- Department API : GET: Retrieve a single department or list all departments
- Employee API : POST - GET - UPDATE - DELETE and handle the workflow to model the onboarding process for new employees (Bouns Task)
- User Accounts API : GET: Retrieve list of all acconuts (Admin Privilage)
- Logging INFO

### Frontend
- Desgin all required pages
- Summary Dashboard page (Bouns Task)
- Employee Report page (Bouns Task)


### Integration
- Integrate the frontend application with the backend API to facilitate data exchange.

---

## API Documentation
open API documentation on http://localhost:8000/swagger/
