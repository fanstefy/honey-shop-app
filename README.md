# 🍯 Nektarika - Organic Honey E-commerce Platform

Nektarika is a modern, full-featured e-commerce web application for selling organic honey products. Built with React, TypeScript, and Firebase, it offers a seamless shopping experience with real-time customer support.

![Nektarika](https://www.nektarika.rs/images/cover.jpg)

## ✨ Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse through various honey products with detailed descriptions
- **Shopping Cart**: Add/remove items, adjust quantities, real-time cart updates
- **Wishlist**: Save favorite products for later
- **Checkout System**: Complete order placement with shipping information
- **Order History**: Track past orders with detailed status updates

### 🔐 User Authentication
- **Email/Password Registration & Login**
- **Google OAuth Integration**
- **Password Reset Functionality**
- **Protected Routes** for authenticated users
- **User Profile Management**

### 💾 State Management & Persistence
- **Zustand** for global state management
- **LocalStorage persistence** for cart and wishlist
- **Firebase Firestore** sync for authenticated users
- **Real-time data synchronization**

### 🎨 User Interface
- **Responsive Design** - works on all devices (mobile, tablet, desktop)
- **GSAP Animations** for smooth page transitions
- **Tailwind CSS** for modern styling
- **React Icons** for consistent iconography
- **Multi-language Support** (English/Serbian)

### 💬 Customer Support
- **Tawk.to Live Chat Integration**
- Real-time messaging with customers
- Mobile app notifications
- Chat history persistence

### 🔥 Firebase Integration
- **Authentication**: Email/Password, Google OAuth
- **Firestore Database**: 
  - User profiles
  - Orders management
  - Cart & Wishlist sync
- **Real-time Updates**

## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Firebase Account** (for backend services)
- **Tawk.to Account** (for live chat)

### Installation

1. **Clone the repository**:
```bash
   git clone https://github.com/yourusername/nektarika.git
   cd nektarika
```

2. **Install dependencies**:
```bash
   npm install
```

3. **Configure Firebase**:
   
   Create a `.env` file in the root directory:
```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. **Configure Tawk.to**:
   
   Update `src/components/TawkToChat.tsx` with your Tawk.to credentials:
```typescript
   s1.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
```

### Running the Application

**Development server**:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production build**:
```bash
npm run build
```

## 📁 Project Structure
```
nektarika/
├── public/
│   ├── index.html
│   └── locales/              # i18n translation files
├── src/
│   ├── assets/
│   │   └── images/           # Product images
│   ├── components/
│   │   ├── header/
│   │   │   └── Header.tsx
│   │   ├── sidebar/
│   │   │   └── Sidebar.tsx
│   │   ├── profile/          # Profile page components
│   │   │   ├── PersonalInformation.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── Favorites.tsx
│   │   │   └── Settings.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductItem.tsx
│   │   ├── TawkToChat.tsx
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.tsx   # Authentication context
│   │   └── LoadingContext.tsx
│   ├── hooks/
│   │   ├── useAuthSync.ts
│   │   └── usePageTransition.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderSuccess.tsx
│   │   ├── Profile.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── services/
│   │   ├── firebaseService.ts
│   │   ├── ordersFirebaseService.ts
│   │   ├── userFirebaseService.ts
│   │   └── wishlistFirebaseService.ts
│   ├── store/
│   │   ├── useShopStore.ts   # Zustand store
│   │   └── useSidebarStore.ts
│   ├── styles/
│   │   └── app.css
│   ├── utils/
│   │   └── utilities.ts
│   ├── lib/
│   │   └── firebase.ts       # Firebase configuration
│   ├── App.tsx
│   └── index.tsx
├── .env                       # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **GSAP** - Animations
- **React Icons** - Icons
- **React Helmet Async** - SEO management
- **i18next** - Internationalization

### State Management
- **Zustand** - Global state
- **Zustand Persist** - State persistence

### Backend & Services
- **Firebase Authentication** - User management
- **Firebase Firestore** - Database
- **Tawk.to** - Live chat support

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 🔥 Firebase Setup

### Firestore Collections Structure

**users/{userId}**
```json
{
  "wishlist": [1, 5, 7],
  "cart": [
    { "id": 3, "quantity": 2 },
    { "id": 8, "quantity": 1 }
  ],
  "lastUpdated": timestamp
}
```

**orders/{orderId}**
```json
{
  "orderId": "ORD-123456789",
  "userId": "user_id",
  "userEmail": "user@example.com",
  "items": [...],
  "subtotal": 45.00,
  "shippingCost": 5.00,
  "total": 50.00,
  "shippingAddress": {
    "fullName": "John Doe",
    "city": "Belgrade",
    "address": "Street 123",
    "phone": "+381601234567"
  },
  "paymentMethod": "cash_on_delivery",
  "status": "pending",
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || request.auth.uid == 'admin_uid');
      allow create: if request.auth != null;
    }
  }
}
```

## 🌐 Deployment

### Netlify (Recommended)

1. Build the project:
```bash
   npm run build
```

2. Create `_redirects` file in `public/` folder:
```
   /*    /index.html   200
```

3. Deploy to Netlify:
```bash
   netlify deploy --prod
```

### Environment Variables on Netlify

Add these in **Site settings → Environment variables**:
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- etc.

## 📱 Live Chat Setup (Tawk.to)

1. Sign up at [Tawk.to](https://www.tawk.to/)
2. Create a new property for your website
3. Get your **Property ID** and **Widget ID**
4. Update `src/components/TawkToChat.tsx`
5. Download the Tawk.to mobile app for notifications

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- Website: [nektarika.rs](https://nektarika.rs)
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing library
- Firebase for backend services
- Tawk.to for customer support solution
- Tailwind CSS for styling framework
- All open-source contributors

## 📧 Contact

For support or inquiries:
- Email: info@nektarika.rs
- Phone: +381 60 123 4567
- Live Chat: Available on website

---

Made with 🍯 and ❤️ by Nektarika Team
