# Team Task Manager - MERN Stack

A full-stack web application for creating projects, assigning tasks, and tracking progress with role-based access control (Admin/Member).

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Authentication, validation
│   │   ├── config/          # Database configuration
│   │   └── utils/           # Helper functions
│   ├── .env                 # Environment variables
│   ├── .env.example         # Environment template
│   ├── server.js            # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   ├── context/         # React context (Auth)
│   │   ├── styles/          # CSS files
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── public/              # Static files
│   ├── .env                 # Environment variables
│   ├── .env.example         # Environment template
│   └── package.json
└── README.md
```

## Features

✅ **Authentication** - Signup/Login with JWT tokens  
✅ **User Management** - Create and manage team members  
✅ **Projects** - Create and manage projects  
✅ **Tasks** - Create, assign, and track tasks  
✅ **Roles** - Admin and Member roles with access control  
✅ **Dashboard** - Overview of projects, tasks, and status  
✅ **Responsive Design** - Mobile-friendly UI

## Tech Stack

**Backend:**

- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS enabled

**Frontend:**

- React 18
- React Router v6
- Axios for API calls
- Context API for state management
- CSS3 for styling

## Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env file with the following variables
# (See .env.example for reference)
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task_manager
JWT_SECRET=your_secret_key_here_min_32_chars
FRONTEND_URL=http://localhost:3000

# Start the server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file with the following variables
# (See .env.example for reference)
REACT_APP_API_URL=http://localhost:5000/api/v1

# Start the dev server
npm start
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Projects

- `GET /api/v1/projects` - Get all projects
- `POST /api/v1/projects` - Create project
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

### Tasks

- `GET /api/v1/tasks` - Get all tasks (with filters)
- `POST /api/v1/tasks` - Create task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

## Environment Variables

### Backend (.env)

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task_manager
MONGODB_USER=
MONGODB_PASSWORD=
JWT_SECRET=your_jwt_secret_key_here_min_32_characters
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
API_VERSION=v1
API_PREFIX=/api/v1
LOG_LEVEL=debug
SESSION_SECRET=your_session_secret_key_here
REDIS_URL=redis://localhost:6379
DEFAULT_PAGE_LIMIT=10
MAX_PAGE_LIMIT=100
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=pdf,doc,docx,xlsx,txt,jpg,png
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_NAME=Task Manager
REACT_APP_VERSION=1.0.0
REACT_APP_ENV=development
REACT_APP_JWT_STORAGE_KEY=token
REACT_APP_REFRESH_TOKEN_KEY=refreshToken
REACT_APP_ENABLE_DEMO_MODE=false
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_DARK_MODE=true
```

## Database Schema

### User Model

- name, email, password, role (admin/member), avatar, isActive, timestamps

### Project Model

- name, description, owner, team[], status, startDate, endDate, timestamps

### Task Model

- title, description, project, assignedTo, status, priority, dueDate, createdBy, attachments[], comments[], timestamps

## Running the Application

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Deployment

### Deploy Backend (Railway/Heroku)

1. Push code to GitHub
2. Connect repository to Railway/Heroku
3. Set environment variables
4. Deploy

### Deploy Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variables
4. Deploy

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please open an issue on GitHub.

---

**Built with ❤️ using MERN Stack**
