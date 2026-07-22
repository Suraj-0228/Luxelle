# Luxelle - Premium Fashion E-Commerce Platform

![Luxelle Banner](https://i.pinimg.com/1200x/0a/5a/4f/0a5a4fc417a4572edc12766127ef4093.jpg)

## 1. Introduction

### 1.1 Project Overview
**Luxelle** is a state-of-the-art e-commerce web application designed specifically for the modern fashion retailer. It bridges the gap between high-end aesthetics and robust technical functionality. The platform is engineered to facilitate the seamless management of a fashion brand's operations—from inventory to customer relations—while offering shoppers a premium, intuitive, and engaging digital storefront.

Unlike generic e-commerce templates, Luxelle focuses on a "Luxury First" design philosophy, utilizing a sophisticated typography system, curated color palettes, glassmorphism UI elements, and premium micro-interactions to elevate the user experience.

### 1.2 Key Objectives
The primary goals of the Luxelle platform are:
*   **Elevate Brand Identity:** To provide a visually stunning interface that reflects the exclusivity of high-fashion products.
*   **Streamline Operations:** To simplify complex e-commerce workflows (inventory, orders, tax settings) for administrators.
*   **Enhance User Engagement:** To create a frictionless journey from product discovery to checkout, reducing cart abandonment.
*   **Ensure Scalability:** To build a robust architecture capable of handling growing traffic and product lines.

---

## 2. System Architecture & Technology Stack

Luxelle is built on the robust **MERN Stack**, ensuring a full JavaScript-based solution that is both scalable and maintainable.

### 2.1 Technology Breakdown

| Component | Technology | Role & Description |
| :--- | :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React 19** | Core user interface framework using React functional components, hooks (`useContext`, `useMemo`, `useEffect`), and Vite for fast compiling and hot-module reloading. |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS v4 & DaisyUI** | Utility-first CSS framework coupled with DaisyUI plugins inside pure CSS config to define a premium dark/gold style theme. |
| **Backend** | ![NodeJS](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) **Node.js** | Server-side runtime that handles API requests and database communication asynchronously. |
| **API Framework** | ![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white) **Express.js** | Minimalistic web framework defining RESTful API routes, schema parsing, and mock auth middleware. |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) **MongoDB** | NoSQL database storing flexible, document-based records for users, orders, categories, and taxes. |

### 2.2 System Design Highlights
*   **Single Page Application (SPA):** Uses React Router v7 for smooth client-side routing.
*   **Modularity**: Highly reusable component architectures (e.g. `ProductCard`, `ProfileSidebar`, `ScrollToTopButton`).
*   **Robust Session Merging**: Automatic merge-handling of JWT auth tokens in local storage to prevent session stripping on profile updates.

---

## 3. Comprehensive Features & Functionality

Luxelle offers a rich set of features divided into three main pillars:

### 3.1 🛍️ Shopping & Discovery
*   **Dynamic Product Catalog**: Advanced filtering by category, price ranges, and designer brands with dynamic star rating badges.
*   **Curated Latest Arrivals Page**: Dedicated `/latest` route showcasing newest inventory releases.
*   **Interactive Product Reviews**: Authenticated customers can submit 1–5 star ratings and detailed feedback via an interactive modal overlay. Reviews display user avatars, verified buyer badges, and automatically calculate real-time product rating averages.
*   **Premium Toaster system**: Dynamic status-based glassmorphic alerts (Success, Error, Info) with slide-in animations and animated countdown progress bars.

### 3.2 👤 Customer Dashboard & Account Management
*   **Account Settings**: Securely change credentials, passwords, and profile options with inline form validations.
*   **Address Book**: Maintain billing and shipping destinations with a strict 6-digit numeric ZIP Code validation guard.
*   **Ultra-HD PDF Invoices**: Generate 4x Retina-quality (300+ DPI) printable tax invoices via `jsPDF` + `html2canvas-pro` with Onyx/Gold luxury branding, concierge guarantee, dynamic destination country tagging, and itemized tax breakdowns.
*   **Wishlist**: Save favorite items to purchase later.

### 3.3 💳 Cart & Checkout Workflow
*   **Persistent State Cart**: Client-side state hook calculations for GST rates, import duties, and processing fees.
*   **Auto-populate saved Address**: Single-click `"Use Stored Address"` button during checkout with instant validation clearance and user feedback.
*   **Luxury Modals**: Customized global SweetAlert2 popups with glassmorphism overlays and gold-accented buttons.

### 3.4 🛡️ Admin Dashboard
*   Full admin controls to create/delete/edit products, manage order delivery stages, add categories, configure tax rules, and manage user roles.

---

## 4. Getting Started Guide

### 4.1 Prerequisites
Ensure you have the following installed:
*   **Node.js** (v18.0.0 or higher)
*   **MongoDB** (Locally installed community server or MongoDB Atlas cluster connection string)

### 4.2 Installation & Setup

#### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/luxelle.git
cd Luxelle
```

#### Step 2: Configure the Backend (Server)
```bash
cd server
npm install    # Install backend dependencies
npm start      # Launch server (runs on localhost:5000)
```

#### Step 3: Configure the Frontend (Client)
Open a new terminal window:
```bash
cd client
npm install    # Install frontend dependencies
npm run dev    # Launch Vite development server
```
The application will launch at `http://localhost:5173`.

---

## 5. Data Models & Schema

### 5.1 Product Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Display name of the product. |
| `brand` | String | Designer or manufacturer brand. |
| `category` | String | Classification (e.g. 'Bags', 'Watches'). |
| `price` | Number | Selling price of the item. |
| `colors` | Array`<String>` | List of available color options. |
| `material` | String | Primary material composition (e.g. 'Leather'). |
| `image` | String | URL path to the product image asset. |
| `stock` | Number | Quantity available in inventory. |
| `reviews` | Array`<Review>` | Nested list of customer reviews (`user`, `name`, `rating`, `comment`). |
| `rating` | Number | Aggregated average rating score (1 to 5 stars). |
| `numReviews` | Number | Total count of submitted product reviews. |

### 5.2 User Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| `fullname` | String | User's full legal name. |
| `email` | String | Unique email used for authentication. |
| `password` | String | Hashed credentials string. |
| `address` | Object | Nested address profile (`street`, `city`, `state`, `zip`, `country`). |
| `isAdmin` | Boolean | Administrative access flag. |

---

## 🚀 6. Production Deployment Instructions

Please consult the detailed **[Deployment Guide](file:///c:/Users/suraj/.gemini/antigravity/brain/ade1aa51-b521-4bcb-8511-3353efae8e3b/deployment_guide.md)** inside the configurations folder for instructions on configuring a cloud MongoDB Atlas cluster, hosting static client files on Vercel, and deploying backend processes on Render.

---

**Developed with ❤️ by the Luxelle Engineering Team**