
# Frescart Ecommerce Website

![Grocery Purchasing Website](https://drive.google.com/uc?export=view&id=1JmwYHH22b3Xp6aKtfyfqfbwIejWiC_Df)
Visit my website [here](link-to-website).

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
   - [User Features](#user-features)
   - [Admin Panel Features](#admin-panel-features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

## Overview
Welcome to our Grocery Purchasing Website! This full stack application allows users to browse and purchase grocery products like fruits and vegetables. It features user authentication, role-based access, product showcasing, filtering and sorting, order management, and much more.

Visit our website [here](link-to-website).

## Features

### User Features
1. **User Authentication**: Secure login and registration system.
2. **Role-Based Access**: Different access levels for users and administrators.
3. **Product Showcasing**: Browse through a variety of grocery products.
4. **Product Filtering and Sorting**: Easily find products using filters and sorting options.
5. **Order Management**: View and manage your orders.
6. **Ordering**: Add products to your cart and place orders.
7. **Write Reviews**: Share your feedback on purchased products.
8. **Update User Data**: Edit your profile information.
9. **Change Password**: Securely change your account password.

### Admin Panel Features
1. **Manage Orders**: View and manage all orders placed by users.
2. **Add, Update, Delete Products**: Admins can add new products, update existing ones, or delete products as needed.

## Technologies Used
- **Frontend**:
  - React
  - React Router
  - Redux
  - Tanstack Query (React Query)
  
- **Backend**:
  - Node.js
  - Express
  
- **Database**:
  - MongoDB
  
- **Other Tools and Libraries**:
  - JWT for authentication
  - bcrypt for password hashing
  - Multer for file uploads (product images)
  - Stripe for payment processing (if applicable)

## Installation

1. **Clone the repository**:
    \`\`\`sh
    git clone https://github.com/your-username/grocery-purchasing-website.git
    cd grocery-purchasing-website
    \`\`\`

2. **Install dependencies**:
    - For the backend:
        \`\`\`sh
        cd backend
        npm install
        \`\`\`
    - For the frontend:
        \`\`\`sh
        cd frontend
        npm install
        \`\`\`

3. **Environment Variables**:
    Create a \`.env\` file in the \`backend\` directory and add the necessary environment variables:
    \`\`\`env
    MONGO_URI=your-mongodb-uri
    JWT_SECRET=your-jwt-secret
    STRIPE_SECRET_KEY=your-stripe-secret-key (if using Stripe)
    \`\`\`

4. **Run the application**:
    - Start the backend server:
        \`\`\`sh
        cd backend
        npm start
        \`\`\`
    - Start the frontend server:
        \`\`\`sh
        cd frontend
        npm start
        \`\`\`

## Usage

- Visit the website using the link provided above.
- Register a new account or login with existing credentials.
- Browse and filter products.
- Add products to your cart and place orders.
- View and manage your orders.
- Write reviews for purchased products.
- Admin users can manage orders and products from the admin panel.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License.
"""

