# CropSense 🌾

> **Intelligent Agriculture: Grow Smarter, Harvest Better**

CropSense empowers farmers and agricultural enterprises with AI-driven insights to maximize yield, minimize waste, and build a secure food supply chain. Leveraging state-of-the-art Generative AI and comprehensive data mapping, CropSense brings predictive intelligence right to the dashboard.

## 🚀 Key Features

*   **Crop Risk Dashboard**: An interactive, SVG-based mapping system that visualizes crop risks and soil distribution across Indian states and districts. Features dynamic coloring and hover functionality for precise geographic analysis.
*   **Supply Chain Intelligence**: A powerful RAG-based AI Agent powered strictly by **Gemini 2.5**. This module automatically monitors regional supply chains, predicts disruptions, and dynamically suggests alternative provider sites using connected metadata.
*   **Site-wide Chatbot**: An intelligent, context-aware interactive chatbot (`SiteChatbot`) that guides users, answers queries, and provides seamless platform navigation.
*   **Modern, Responsive UI/UX**: Built with a sleek dark glassmorphism aesthetic. The frontend combines Framer Motion's fluid animations with Shadcn UI components for a premium user experience.
*   **Real-time Analytics**: Integrates Recharts to provide clear, actionable data visualizations regarding crop yields and risk metrics.

## 🛠️ Technology Stack

*   **Frontend Framework**: [React 18](https://react.dev/) with [Vite](https://vitejs.dev/) & [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom utility functions, [Shadcn UI](https://ui.shadcn.com/) components
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **AI Integration**: [Google Generative AI (Gemini 2.5 SDK)](https://ai.google.dev/)
*   **Data Visualization**: [Recharts](https://recharts.org/)
*   **State & Query Management**: [@tanstack/react-query](https://tanstack.com/query/latest)
*   **Backend & Authentication**: [Supabase](https://supabase.com/)

## 📦 Getting Started

### Prerequisites

*   **Node.js**: v18.0.0 or higher
*   **Package Manager**: `npm` or `bun`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cropsense.git
    cd incseption/cropsense-landing
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Environment Variables:**
    Copy the sample environment file and fill in your API keys (like Supabase and Gemini).
    ```bash
    cp .env.example .env.local
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    bun dev
    ```

5.  Open your browser and navigate to `http://localhost:8080` (or the port specified by Vite).

## 🗂️ Project Structure

*   `src/components`: UI elements ranging from layout items (Navbar, Footer) to specific shadcn components. Includes `landing` for landing page specific sections.
*   `src/pages`: Distinct application views (`DashboardPage`, `Explore`, `SupplyChain`, `CropRisk`).
*   `src/contexts`: Application-wide context providers (e.g., `AuthContext`).
*   `src/data`: Structured JSON configuration files containing mappings for soil, district coordinates, provider sites, and news sources used by the AI RAG system.
*   `src/lib`: Core utility functions including tailored Tailwind CSS merge logic.

## 🧠 AI Migration (Gemini 2.5)

CropSense has undergone a strict migration to deprecate legacy models and **exclusively utilize the Gemini 2.5 model family**. The overarching supply-chain and chatbot logic is designed without forced fallbacks, meaning users reap the benefits of Google's latest multimodal capabilities securely.


## 📄 License

This project is proprietary and confidential.
