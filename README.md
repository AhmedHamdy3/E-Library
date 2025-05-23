
# 📚 E-Library Management System

A modern E-Library platform built with Angular frontend and ASP.NET Web API backend, featuring role-based access control, JWT authentication, and a comprehensive book management system.

---

## 🌟 Overview  
[![E-Library Demo Preview](https://github.com/AhmedHamdy3/E-Library/blob/main/Demo.gif)](https://youtu.be/m7bOpI8hBwI)

*↑ Click to watch full demo (YouTube)*  

---
## ✨ Features

### 🔒 Authentication & Authorization
- ✅ User registration and login system  
- 🔑 JWT-based secure communication  
- 👨‍💼 Role-based access control (Admin, User)  
- 🛡️ Protected routes with Angular guards  
- 💾 Token storage in localStorage  

### 📚 Book Management
- 🔍 Browse books with pagination and search  
- 📖 View book details  
- 🛒 Purchase books (user role)  
- ⚙️ Full CRUD operations (admin role)  

### 👥 User Management (Admin)
- 👀 Browse Users with pagination and search  
- 🆕 Create, read, update, and delete users  
- 🏷️ Assign roles to users  

### 🗃️ Category Management (Admin)
- 📂 Browse Categories with pagination and search  
- 📚 Organize books into categories  
- 🌳 Hierarchical category structure  
- 🏷️ Easy book categorization  

---

## 🛠️ Technical Implementation

### **Backend**
- 🏗 ASP.NET Web API with RESTful endpoints  
- 🗄 Entity Framework Core for data access  
- 🎯 SQL Server database  
- 📊 Proper HTTP status codes and error handling  
- ✔️ Comprehensive input validation  

### **Frontend**
- ⚡ Angular 15+ with TypeScript  
- 📝 Angular forms with validation  
- 🚀 Standalone Component Architecture
- 🔄 HttpClient service with observables  

---

## 🚀 Getting Started

### Prerequisites
- .NET 9
- Angular CLI 19
- SQL Server
- Node.js 22

### ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AhmedHamdy3/E-Library.git
   cd elibrary-system
   ```

2. **Backend Setup**
   - Configure `appsettings`:
     Create the appsettings.json file in the WebAPI project root with these settings:
     ```json    
     {
       "ConnectionStrings": {
         "DefaultConnection": "Data Source=YOUR_SERVER;Initial Catalog=E-Library;Integrated Security=True;Encrypt=False;Trust Server Certificate=True"
       },
       "JWT": {
         "Iss": "YOUR_API_BASE_URL",
         "Aud": "YOUR_CLIENT_URL",
         "Key": "YOUR_SECURE_RANDOM_KEY"
       }
     }
     ```
   - Apply migrations:
     ```bash
     update-database
     ```
   - Run the API

3. **Frontend Setup**
   ```bash
   cd ../Angular
   npm install
   ```
   - Configure API base URL in `environment.ts`
   - Run the Angular app:
     ```bash
     ng serve
     ```

---

## 📄 API Documentation

The Web API follows RESTful principles with these main endpoints:

### 🔐 Authentication
- `POST /api/account/register` - User registration  
- `POST /api/account/login` - User login  

### 📚 Books
- `GET /api/book` - Get paginated book list  
- `GET /api/book/{id}` - Get book details  
- `POST /api/book` - Create new book (Admin)  
- `PUT /api/book/{id}` - Update book (Admin)  
- `DELETE /api/book/{id}` - Delete book (Admin)  

### 👥 Users
- `GET /api/user` - Get all users (Admin)  
- `GET /api/user/{id}` - Get user details (Admin)  
- `PUT /api/user/{id}` - Update user (Admin)  
- `DELETE /api/user/{id}` - Delete user (Admin)  

### 🗂 Categories
- `GET /api/category` - Get all categories  
- `POST /api/category` - Create category (Admin)  
- `PUT /api/category/{id}` - Update category (Admin)  
- `DELETE /api/category/{id}` - Delete category (Admin)  

---

## 🏗 Project Structure

```
E-Library/
├── Frontend/                  # Angular application
│   ├── src/
│   │   ├── app/               # Main application modules
│   │   ├── components/        # Reusable UI components
│   │   ├── guards/            # Route protection logic
│   │   ├── models/            # Type definitions and interfaces
│   │   ├── services/          # API service layers
│   │   ├── environments/      # Build configurations
│   │   └── ...               # Other Angular files
│
├── Backend/                   # ASP.NET Web API
│   ├── Controllers/           # API endpoints
│   ├── CustomValidation/      # Custom validation logic
│   ├── DTOS/                  # Data transfer objects
│   ├── MappingConfigs/        # AutoMapper profiles
│   ├── Migrations/            # Database schema versions
│   ├── Models/                # Entity models
│   ├── Repositories/          # Data access layer
│   ├── UOW/                   # Unit of Work pattern
│   ├── appsettings.json       # Configuration file
│   └── ...                    # Other backend files
│
└── README.md                  # Project documentation
```
