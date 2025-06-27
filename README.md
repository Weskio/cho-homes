# 🏠 ChoHomes - Real Estate Platform

A modern, responsive real estate platform built with React, TypeScript, and Firebase. ChoHomes provides a comprehensive solution for property listings, user management, and admin functionality with a beautiful, dark-themed UI.

## ✨ Features

### 🏡 Public Features

- **Property Listings**: Browse and search through available properties
- **Property Details**: Detailed view of individual properties with photos and information
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Dark theme with smooth animations and transitions
- **Contact Forms**: Easy communication with property owners
- **Newsletter Subscription**: Stay updated with new listings

### 🔐 Admin Features

- **Authentication**: Secure login and registration system
- **Dashboard**: Overview of platform statistics and metrics
- **Property Management**: Add, edit, and delete property listings
- **User Management**: Manage user accounts and permissions
- **Message Center**: Handle inquiries and communications
- **Data Import/Export**: Bulk property data management

### 🎨 UI/UX Features

- **Smooth Animations**: Framer Motion powered page transitions
- **Interactive Components**: Swiper carousels, toast notifications
- **Optimized Images**: Lazy loading and optimization
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: User-friendly error pages and notifications

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety and better development experience
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hot Toast** - Toast notifications
- **Swiper** - Touch slider component
- **React Icons** - Icon library

### Backend & Services

- **Firebase** - Backend as a Service
  - Firestore - NoSQL database
  - Authentication - User management
  - Storage - File and image storage
- **Axios** - HTTP client for API calls

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Analytics & Performance

- **Vercel Analytics** - Website analytics
- **Vercel Speed Insights** - Performance monitoring

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase project setup

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cho-homes
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
cho-homes/
├── public/                 # Static assets
│   └── images/            # Image files
├── src/
│   ├── components/        # Reusable components
│   │   ├── auth/         # Authentication components
│   │   ├── cards/        # Card components
│   │   ├── forms/        # Form components
│   │   ├── header/       # Header components
│   │   ├── layout/       # Layout components
│   │   └── reusables/    # Reusable UI components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   ├── home/         # Home page
│   │   ├── properties/   # Property pages
│   │   └── ...           # Other pages
│   ├── services/         # API and Firebase services
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── constants/        # Static data and interfaces
├── functions/            # Firebase functions (if any)
└── ...                   # Configuration files
```

## 🎯 Key Features Implementation

### Authentication System

- Protected routes with React Router
- Firebase Authentication integration
- Role-based access control
- Automatic session management

### Property Management

- CRUD operations for properties
- Image upload and management
- Search and filtering capabilities
- Property categorization

### Admin Dashboard

- Real-time statistics
- User management interface
- Property listing management
- Message center for inquiries

### Responsive Design

- Mobile-first approach
- Tailwind CSS for styling
- Custom dark theme
- Optimized for all screen sizes

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🌐 Deployment

The project is configured for deployment on Vercel with:

- Automatic builds from Git
- Environment variable management
- Analytics and performance monitoring
- CDN optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Advanced search filters
- [ ] Property comparison feature
- [ ] Virtual tour integration
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Payment integration
- [ ] Email notifications

---

**Built with ❤️ using React, TypeScript, and Firebase**
