# 🚀 Abdullah Al Mahmud Portfolio

A modern, responsive portfolio website showcasing skills, education, experience, and projects. Built with HTML5, CSS3, JavaScript, PHP, and MySQL.

## ✨ Features

### 🎨 **Design & User Experience**
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX** - Clean, professional design with vibrant gradients
- **Smooth Animations** - Typing effects, hover animations, and page transitions
- **Dark Theme** - Eye-friendly dark background with colorful accents
- **Interactive Elements** - Dynamic content loading and user interactions

### 🍪 **Cookie Management**
- **GDPR Compliant** - Cookie consent banner with user preferences
- **Customizable Timing** - Configurable popup display and expiration times
- **User Preferences** - Theme settings and visit tracking
- **Privacy Focused** - Transparent cookie usage and easy opt-out

### 🔧 **Admin Panel**
- **Content Management** - Add/edit skills, education, experience, and projects
- **Real-time Updates** - Changes reflect immediately on the website
- **Form Validation** - Client-side and server-side validation
- **Secure Access** - Email-based authentication system

### 📧 **Contact System**
- **Email Integration** - PHPMailer for reliable email delivery
- **Database Storage** - Contact messages saved to MySQL database
- **Form Validation** - Comprehensive input validation and sanitization
- **User Feedback** - Success/error messages with modal dialogs

## 🛠️ **Technology Stack**

### **Frontend**
- **HTML5** - Semantic markup and modern structure
- **CSS3** - Advanced styling with Flexbox, Grid, and animations
- **JavaScript (ES6+)** - Modern JavaScript with classes and modules
- **Font Awesome** - Professional icons and symbols

### **Backend**
- **PHP 7.4+** - Server-side processing and API endpoints
- **MySQL** - Database for storing portfolio data
- **PHPMailer** - Email functionality for contact forms
- **Composer** - Dependency management

### **Development Tools**
- **XAMPP** - Local development environment
- **Git** - Version control
- **VS Code** - Recommended code editor

## 📁 **Project Structure**

```
portfolio/
├── 📄 HTML Pages
│   ├── home.html          # Main homepage with about section
│   ├── skill.html         # Skills showcase page
│   ├── education.html     # Educational background
│   ├── experience.html    # Professional experience
│   ├── work.html          # Projects and work portfolio
│   ├── contact.html       # Contact form page
│   └── admin.html         # Admin panel for content management
│
├── 🎨 Styling
│   └── css/
│       └── style.css      # Main stylesheet with responsive design
│
├── ⚡ JavaScript
│   ├── js/main.js         # Main functionality and navigation
│   ├── js/simple-cookies.js # Cookie management system
│   ├── js/typing-effect.js # Typing animation utility
│   └── js/database-loader.js # Dynamic content loading
│
├── 🔧 PHP Backend
│   ├── php/db_connect.php     # Database connection
│   ├── php/contact-form.php   # Contact form handler
│   ├── php/get_*.php          # Data retrieval APIs
│   └── php/admin_*.php        # Admin panel APIs
│
├── 🖼️ Assets
│   ├── img/               # Images and media files
│   └── vendor/            # Third-party dependencies
│
└── 📊 Database
    └── portfolio_db       # MySQL database with portfolio data
```

## 🚀 **Installation & Setup**

### **Prerequisites**
- **XAMPP** (Apache + MySQL + PHP)
- **Web Browser** (Chrome, Firefox, Safari, Edge)
- **Code Editor** (VS Code recommended)

### **Step-by-Step Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/almahmud0303/portfolio.git
   cd portfolio
   ```

2. **Start XAMPP**
   - Start **Apache** and **MySQL** services
   - Open XAMPP Control Panel

3. **Database Setup**
   ```sql
   CREATE DATABASE portfolio_db;
   -- Import the provided SQL schema
   ```

4. **Configure Database Connection**
   ```php
   // Update php/db_connect.php
   $servername = "localhost";
   $username = "root";
   $password = ""; // Your MySQL password
   $dbname = "portfolio_db";
   ```

5. **Install Dependencies**
   ```bash
   composer install
   ```

6. **Configure Email (Optional)**
   ```php
   // Update php/contact-form.php
   $mail->Username = 'your-email@gmail.com';
   $mail->Password = 'your-app-password';
   ```

7. **Access the Portfolio**
   - Open: `http://localhost/portfolio/home.html`
   - Admin Panel: `http://localhost/portfolio/admin.html`

## 🎯 **Usage Guide**

### **For Visitors**
1. **Browse Sections** - Navigate through Home, Skills, Education, Experience, Work
2. **View Projects** - Explore detailed project showcases
3. **Contact** - Use the contact form to get in touch
4. **Cookie Preferences** - Manage your privacy settings

### **For Admin (Content Management)**
1. **Access Admin Panel** - Click the gear icon or visit `/admin.html`
2. **Login** - Use authorized email: `lazy21226@gmail.com`
3. **Add Content** - Use tabs to add Skills, Education, Experience, Projects
4. **Manage Data** - All changes are saved to the database

## 🔧 **Configuration**

### **Cookie Settings**
```javascript
// In js/simple-cookies.js
setTimeout(() => {
    window.simpleCookies.showCookieConsent();
}, 5000); // Popup delay (5 seconds)

this.setCookie('cookieConsent', 'accepted', 0.00347); // Expiration (5 minutes)
```

### **Database Schema**
- **skills** - Technical and soft skills
- **skill_categories** - Skill categorization
- **education** - Educational background
- **experience** - Professional experience
- **projects** - Portfolio projects
- **contacts** - Contact form submissions

## 🎨 **Customization**

### **Colors & Themes**
```css
:root {
    --primary-color: #6a11cb;
    --secondary-color: #ffb347;
    --accent-color: #00bcd4;
    --text-color: #e0e0e0;
}
```

### **Content Management**
- **Skills** - Add/remove technical skills and categories
- **Education** - Update educational background
- **Experience** - Manage professional history
- **Projects** - Showcase your work portfolio

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### **Mobile Features**
- **Hamburger Menu** - Collapsible navigation
- **Touch Optimized** - Large buttons and touch targets
- **Fast Loading** - Optimized for mobile networks

## 🔒 **Security Features**

- **Input Sanitization** - XSS protection
- **SQL Injection Prevention** - Prepared statements
- **Form Validation** - Client and server-side validation
- **Email Security** - SMTP authentication

## 🚀 **Performance**

- **Optimized Images** - Compressed and responsive
- **Minified Assets** - Reduced file sizes
- **Efficient Queries** - Optimized database operations
- **Caching** - Browser and server-side caching

## 📊 **Analytics & Tracking**

- **Visit Tracking** - Page views and user behavior
- **Cookie Analytics** - User preference tracking
- **Contact Analytics** - Form submission tracking

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 **License**

This project is open-source and available under the MIT License.

## 👨‍💻 **Developer**

**Abdullah Al Mahmud**
- **LinkedIn:** [al-mahmud-shihab-872352249](https://www.linkedin.com/in/al-mahmud-shihab-872352249/)
- **GitHub:** [almahmud0303](https://github.com/almahmud0303)
- **Email:** lazy21226@gmail.com

## 🆘 **Support**

If you encounter any issues or have questions:
1. Check the documentation
2. Review the code comments
3. Open an issue on GitHub
4. Contact the developer

---

**Built with ❤️ by Abdullah Al Mahmud**