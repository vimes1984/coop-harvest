# Contributing to Growers' Collective ☘️

Thank you for your interest in contributing to **Growers' Collective**! Whether you are a developer, designer, copywriter, farmer, or community activist, your help is invaluable in building a fairer, direct farm-to-consumer cooperative network.

> [!IMPORTANT]
> **PROOF OF CONCEPT (PoC) STATE**  
> This project is currently a local development prototype and Proof of Concept. We do not have active users or live transactions yet. All codebase styling, mock ledgers, and localization data are designed to validate the architecture for a future live pilot.

---

## 🗺️ How to Get Involved

We welcome contributions in many forms:
* **💻 Development**: Fixing bugs, adding features to the React frontend or Express backend, or improving native packaging (Electron/Capacitor).
* **🎨 UI/UX Design**: Improving the responsive mobile/desktop layouts, designing accessible dashboards, or creating graphics.
* **✍️ Copywriting & Localization**: Creating stories for local Irish farms, translating terms, or refining educational content about food sovereignty.
* **🚜 Outreach & Logistics**: Designing community distribution templates (e.g. GAA pickup guides, parish center guidelines).

---

## 🛠️ Local Development Setup

The project is structured as a decoupled monorepo containing a `/frontend` (React + TypeScript) and `/backend` (Express + MongoDB).

### Prerequisites
* Node.js (version 16.x or newer recommended)
* MongoDB (either local instance or a free [MongoDB Atlas Cluster](https://www.mongodb.com/cloud/atlas))
* Git

### Step-by-Step Environment Setup

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/vimes1984/coop-harvest.git
   cd coop-harvest
   ```

2. **Configure the Backend**:
   - Navigate to `/backend`.
   - Copy `.env.example` to `.env` (or create a new `.env` file).
   - Set up your `MONGO_URI` (e.g., connection string from Atlas) and your desired `PORT` (defaults to `5001`).
   - Install dependencies and start the development server:
     ```bash
     npm install
     npm run dev
     ```
   - *Note: If MongoDB is connected and empty, the server will automatically seed initial mock Irish growers, produce, and proposals.*

3. **Configure the Frontend**:
   - Navigate to `/frontend`.
   - Install dependencies:
     ```bash
     npm install --ignore-scripts
     ```
   - Start the Vite development server:
     ```bash
     npm run dev
     ```
   - Open your browser to [http://localhost:5173](http://localhost:5173).

---

## 🤝 Contribution Workflow

We follow a standard fork-and-pull model:

1. **Find an Issue**: Browse open issues or open a new one to discuss a feature proposal or bug report.
2. **Create a Branch**: Create a feature branch off of `main` naming it descriptively (e.g., `feature/add-csa-calculator` or `bugfix/fix-checkout-total`).
3. **Commit Your Changes**:
   - Keep commits focused and write clear, descriptive commit messages.
   - Preserving the status of this codebase as a **Proof of Concept** is critical. Ensure any added text clearly frames splits/operations as *projections/target models* to avoid misleading users.
4. **Submit a Pull Request (PR)**:
   - Provide a clear summary of your changes and reference the issue number.
   - Ensure your code compiles successfully (`npm run build` runs without errors in both backend and frontend).

---

## 🎨 Code & Design Guidelines

To maintain visual and technical excellence:
* **Strong Typing**: Use TypeScript interfaces for all data models, component props, and API responses. Avoid using `any`.
* **Vanilla CSS**: We style components using clean, flexible CSS tokens inside `/frontend/src/App.css` rather than bloated utility frameworks. Keep to the premium green/warm earthy, glassmorphic palette.
* **Zero Placeholder Policy**: Do not leave unfinished `// TODO` comments or broken mock layouts. Ensure a fully functioning mock-fallback state exists if the database server is offline.

---

## 📜 Cooperative Conduct

As a community-driven project focused on food sovereignty, ecological farming, and democratic governance, we value respect, open collaboration, and inclusivity. Please support others, collaborate transparently, and respect diverse backgrounds.

If you have questions, please reach out by opening an issue on GitHub!
