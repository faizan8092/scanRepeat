# 🚀 scanRepeat

**scanRepeat** is a premium, all-in-one platform for creating dynamic QR codes, building custom landing pages, and tracking advanced analytics. Designed for brands and creators who want to bridge the physical and digital worlds with style.

![scanRepeat Banner](https://images.unsplash.com/photo-1590650046871-92c8872c5f16?q=80&w=2070&auto=format&fit=crop)

## ✨ Features

- **🎨 Advanced QR Customizer**: Create beautiful, branded QR codes with custom colors, logos, and frame styles.
- **🏗️ Visual Page Builder**: Drag-and-drop editor to create mobile-optimized landing pages for your QR codes.
- **📊 Real-time Analytics**: Track scans, location data, and device types with interactive charts using Recharts.
- **🛍️ Product Management**: Organize your QR codes by products or campaigns for easy management.
- **🤖 AI-Powered**: Integration with Google Gemini AI to help generate content and descriptions.
- **🌓 Dark Mode**: Fully responsive UI with a sleek dark/light mode toggle.
- **🔒 Secure Auth**: Built-in authentication system with custom Auth Providers.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Components**: [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Drag & Drop**: [Dnd Kit](https://dndkit.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms & Logic**: [Sonner Toasts](https://sonner.emilkowal.ski/), [React Dropzone](https://react-dropzone.js.org/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm / yarn / pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/faizan8092/scanRepeat.git
   cd scanRepeat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
   # Add other keys as required
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📂 Project Structure

```bash
src/
├── app/          # Next.js App Router (Pages, Layouts, Global Styles)
├── components/   # Reusable UI components
│   ├── builder/  # Page builder specific components
│   ├── dashboard/# Dashboard UI components
│   ├── products/ # QR & Product management components
│   └── ui/       # Shared UI primitives (Buttons, Inputs, etc.)
├── hooks/        # Custom React hooks
├── lib/          # API services, contexts, utilities, and Redux store
└── types/        # TypeScript Definitions
```

## 🚢 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add your environment variables in the Vercel dashboard.
4. Deploy!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ by [Faizan](https://github.com/faizan8092)
