# Postly - Modern Social Media Application

A full-stack social media web application built with React, TypeScript, FastAPI, and SQLite. Postly allows users to create accounts, share posts with text and images, and interact with a modern, responsive interface.

> **📚 Educational Purpose**: This project serves as a comprehensive tutorial to learn both FastAPI and React in a modern way, created by Abdelhakim KHAOUITI - AI Software Engineer specializing in full-stack development and modern web technologies.

## 🚀 Features

### 🔐 Authentication & User Management
- **User Registration**: Create new accounts with email, first name, last name, and birthday
- **Secure Login**: JWT-based authentication with automatic token management
- **User Profiles**: View personal profile information with creation date
- **Protected Routes**: Secure pages that require authentication

### 📝 Post Management
- **Create Posts**: Share thoughts with text content up to 500 characters
- **Image Uploads**: Attach images to posts (JPEG, PNG, GIF up to 5MB)
- **Edit Posts**: Modify your existing posts
- **Delete Posts**: Remove posts you no longer want
- **Real-time Updates**: Automatic refresh and real-time post updates

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface built with Tailwind CSS
- **Fixed Header**: Persistent navigation bar for easy access
- **Hashtag Styling**: Automatic blue highlighting of hashtags (#example)
- **Loading States**: Smooth loading animations and skeleton screens
- **Toast Notifications**: User-friendly success and error messages
- **Mobile Responsive**: Optimized for all device sizes

### 🖼️ Media Features
- **Image Support**: Upload and display images in posts
- **File Validation**: Automatic file type and size validation
- **Media Management**: Secure file storage and retrieval

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **React Hook Form** - Efficient form handling
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons
- **Date-fns** - Date formatting utilities

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Pydantic** - Data validation and settings management
- **JWT (python-jose)** - JSON Web Token authentication
- **Bcrypt (passlib)** - Password hashing
- **Uvicorn** - ASGI server

## 📁 Project Structure

```
postly/
├── api/                          # Backend API
│   ├── app/
│   │   ├── controllers/          # Business logic
│   │   ├── models/              # Database models
│   │   ├── routes/              # API endpoints
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Service layer
│   │   └── utils/               # Utilities
│   ├── uploads/                 # Media storage
│   ├── requirements.txt         # Python dependencies
│   └── run.py                   # Application entry point
├── client/                      # Frontend React app
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── contexts/            # React contexts
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Utility functions
│   └── package.json             # Node.js dependencies
└── common/                      # Shared utilities
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/khaouitiabdelhakim/postly.git
   cd postly
   ```

2. **Set up the Backend**
   ```bash
   cd api
   
   # Create virtual environment
   python -m venv env
   
   # Activate virtual environment
   # On Windows:
   env\Scripts\activate
   # On macOS/Linux:
   source env/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run the API server
   python run.py
   ```
   The API will be available at `http://localhost:8001`

3. **Set up the Frontend**
   ```bash
   cd ../client
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000` (or next available port)

### Environment Configuration

Create a `.env` file in the `api` directory for production [copy it from .en.example]:
```env
# App Configuration
APP_NAME=Postly API
VERSION=1.0.0

# Database
DATABASE_URL=sqlite:///./your-database-name.db

# Security - CHANGE THESE IN PRODUCTION! [use the generator in the common folder to get a key]
SECRET_KEY=your-super-secret-key-change-this-in-production-make-it-long-and-random 
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Upload
UPLOAD_DIR=uploads-folder-name
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - User login
- `GET /auth/me` - Get current user profile

### Posts Endpoints
- `GET /posts` - Get all posts (with pagination)
- `GET /posts/{post_id}` - Get specific post
- `POST /posts` - Create new post
- `PUT /posts/{post_id}` - Update post
- `DELETE /posts/{post_id}` - Delete post
- `POST /posts/{post_id}/upload` - Upload image to post
- `GET /posts/users/{user_id}` - Get user's posts

### Media Endpoints
- `GET /posts/media/{filename}` - Serve uploaded images

Interactive API documentation is available at `http://localhost:8001/docs` when the server is running.

## 🎯 Usage

### Creating an Account
1. Click "Sign up" on the login page
2. Fill in your email, first name, last name, and birthday
3. Create a secure password
4. Click "Create Account"

### Making Posts
1. Click the "New Post" button in the header
2. Write your message (up to 500 characters)
3. Use hashtags by typing # followed by your tag
4. Click "Create Post"
5. Optionally upload an image after creation

### Managing Posts
- **Edit**: Click the menu (⋯) on your posts and select "Edit"
- **Delete**: Click the menu (⋯) on your posts and select "Delete"
- **Upload Image**: Click the menu (⋯) and select "Upload Image"

## 🔧 Development

### Frontend Development
```bash
cd client
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run ESLint
```

### Backend Development
```bash
cd api
python run.py   # Start development server
```

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```

**Backend:**
```bash
cd api
# Set production environment variables
export SECRET_KEY="your-production-secret"
python run.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under a custom MIT License with Educational and Commercial Use Guidelines - see the [LICENSE](LICENSE) file for details.

**📚 Educational Use**: Free for all educational purposes, learning, and tutorials.  
**💼 Commercial Use**: For commercial applications and cloud deployment support, contact [KHAOUITI Apps](https://www.khaouitiapps.com/price).

## 👥 Authors

- **Abdelhakim KHAOUITI** - *Creator & AI Software Engineer* - [@khaouitiabdelhakim](https://github.com/khaouitiabdelhakim)
  
  AI Software Engineer at Leyton CognitX @ENSIAS specializing in Transformers, AI agents, and LLMs. Technical expertise built on 3+ years of mobile development (Kotlin/Java) and 2.5+ years of full-stack experience (Laravel, Spring Boot, Angular, React, Vue, Django, FastAPI and more). Co-founder of Progma Academy and owner of [KHAOUITI Apps](https://www.khaouitiapps.com).

## 🙏 Acknowledgments

- React team for the amazing framework
- FastAPI for the excellent backend framework
- Tailwind CSS for the beautiful styling system
- All contributors who help improve this project

## 🐛 Known Issues

- Image uploads are limited to 5MB
- Posts are limited to 500 characters
- Currently supports SQLite only (PostgreSQL support planned)

## 🗺️ Roadmap

- [ ] User following/followers system
- [ ] Post likes and comments
- [ ] Real-time notifications
- [ ] Dark mode support
- [ ] PostgreSQL support
- [ ] Docker containerization
- [ ] Search functionality
- [ ] Post categories/tags

---

**Star ⭐ this repository if you find it helpful!**