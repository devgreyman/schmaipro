# EduPortal - Multi-School Educational Platform

A modern React educational platform featuring dynamic school logo detection on login, student registration capture, administrative dashboard, class portal generator, and notification dispatching.

---

## 🌟 Key Features

### 1. Student Portal & Dynamic School Detection
- **Auto-Detection of School**: Typing a school email (e.g. `student@school1.edu`, `student@stanford.edu`, `student@mit.edu`, `student@unilag.edu.ng`) dynamically pops up that school's logo and verified institution badge on the login card.
- **14 Pre-Loaded Schools**: Pre-configured with distinct logos, brand colors, domains, and mottos.
- **Student Verification**: Collects School Email & Student Registration Number (`regno`).
- **Welcome & Auto-Redirect**: Displays an authenticated welcome screen with student and institution details and an animated countdown to redirect destination.

### 2. Admin Management Console (Dark Theme)
- **Protected Access**: Admin login with username & password (`admin` / `password123`).
- **School Profiles & Logo Upload**: Add new schools, set custom email domains, and upload real logo image files directly from your computer.
- **Page Generator**: Generate custom login pages for different classes with unique class codes, shareable links (`?class=...`), and QR codes.
- **Configurable Redirect URL**: Admin can customize the redirect destination (internal or external URL) and countdown delay.
- **Captured Data**: Review student login timestamps, registration numbers, emails, and detected schools in real-time with CSV export.
- **Email Notifications**: Add admin email inboxes that receive student login events upon verification.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation & Setup

1. **Clone or extract the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173`

---

## 🔐 Default Admin Credentials

- **Username**: `admin`
- **Password**: `password123`
*(Can be customized via Admin Settings)*

---

## 🛠️ Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage persistence
