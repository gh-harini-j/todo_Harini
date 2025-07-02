# Todo List Application

## Description
A full-stack Todo List application where users can register, log in, create, assign, and manage tasks. Admins can view and manage all tasks.

## Installation Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/gh-harini-j/todo_Harini.git
   cd todo_Harini
   ```

2. **Backend Setup:**
   - Install Java 17+ and Maven.
   - Navigate to the backend folder:
     ```sh
     cd todoapp
     ```
   - Build the project:
     ```sh
     ./mvnw clean install
     ```
   - Start the backend server:
     ```sh
     ./mvnw spring-boot:run
     ```
   - The backend runs on [http://localhost:8080](http://localhost:8080).

3. **Frontend Setup:**
   - Open a new terminal and navigate to the frontend folder:
     ```sh
     cd frontend
     ```
   - Install dependencies:
     ```sh
     npm install
     ```
   - Start the frontend server:
     ```sh
     npm run dev
     ```
   - The frontend runs on [http://localhost:5173](http://localhost:5173).

## How to Run the Project

- Start the backend and frontend as described above.
- Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

- User registration and login
- Add new tasks
- Assign tasks to other users
- Mark tasks as completed
- Star/unstar tasks
- Delete tasks
- Admin can view, edit, and delete all tasks
- Responsive design
- Data persistence using H2 file-based database

## Usage

- Register a new user or log in.
- Create tasks and assign them to yourself or others.
- Admin users can manage all tasks.
- Access the H2 database console at [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:file:./data/todoappdb`, username: `sa`, password: `password`).

## Technologies Used

- Frontend: React, Material UI, Axios, Vite
- Backend: Java, Spring Boot, Spring Security, Spring Data JPA, H2 Database, JWT

## How GitHub Copilot Was Used

GitHub Copilot was used to auto-generate boilerplate code, suggest function implementations, and improve code efficiency during development. It helped speed up repetitive tasks and provided useful suggestions for naming conventions and logic structures.

## Project Structure

```
todo_Harini/
├── frontend/
│   └── ... (React app)
├── todoapp/
│   └── ... (Spring Boot app)
└── README.md
```