# Postly Frontend

A modern React TypeScript frontend for the Postly social media application, built with TailwindCSS and professional design patterns.

## Features

- **Authentication**: Complete signup/signin with JWT token management
- **Post Management**: Create, read, update, delete posts with real-time updates
- **Media Upload**: Image upload functionality for posts
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Professional UI**: Modern, clean interface with smooth animations
- **Type Safety**: Full TypeScript integration for better development experience
- **Error Handling**: Comprehensive error handling with toast notifications

## Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **TailwindCSS 3.0** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form handling
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Date-fns** - Date formatting utility
- **Vite** - Build tool and dev server

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Running Postly API server (http://localhost:8001)

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CreatePostModal.tsx
│   ├── Layout.tsx
│   ├── PostCard.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── ProfilePage.tsx
│   └── SignupPage.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── auth.ts
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## API Integration

The frontend integrates with all Postly API endpoints:

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `GET /auth/me` - Get current user

### Posts
- `GET /posts` - Get all posts (with pagination)
- `GET /posts/{id}` - Get single post
- `POST /posts` - Create new post
- `PUT /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post
- `POST /posts/{id}/upload` - Upload media to post

## Features Implementation

### Authentication Flow
- JWT token stored in secure HTTP-only cookies
- Automatic token refresh and validation
- Protected routes with authentication guards
- Automatic redirect to login for unauthenticated users

### Post Management
- Real-time post creation and updates
- Image upload with file validation
- Post editing with optimistic updates
- Confirmation dialogs for destructive actions

### UI/UX Features
- Loading states for all async operations
- Error handling with user-friendly messages
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Professional color scheme and typography

### Form Validation
- Client-side validation with React Hook Form
- Real-time validation feedback
- Password strength requirements
- Email format validation

## Styling

The app uses TailwindCSS with a custom design system:

- **Primary Colors**: Blue theme for branding
- **Secondary Colors**: Gray scale for UI elements
- **Typography**: Inter font family
- **Components**: Reusable utility classes
- **Animations**: Custom keyframes for smooth interactions

## Environment Configuration

The frontend is configured to work with the API server at `http://localhost:8001`. To change this, update the `baseURL` in `src/services/api.ts`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new components
3. Add proper error handling for API calls
4. Test responsive design on different screen sizes
5. Update this README if adding new features

## License

This project is part of the Postly application suite.
