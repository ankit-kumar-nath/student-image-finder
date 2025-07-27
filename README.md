# Student Image Lookup - GIET University

A modern web application for finding student images by roll number from GIET University portal.

## 🎯 Features

- **Student Search**: Look up student images using their roll number
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Fast Performance**: Powered by Vite and React
- **Type Safety**: Full TypeScript implementation

## 🚀 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase
- **Routing**: React Router v6
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── StudentImageLookup.tsx
├── pages/              # Route components
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
└── integrations/       # External service integrations
    └── supabase/       # Supabase configuration
```

## 🎨 Design System

This project uses a comprehensive design system built with:
- **Tailwind CSS** for utility-first styling
- **CSS Custom Properties** for theming
- **shadcn/ui** for consistent component library
- **Dark/Light Mode** support

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Deploy with Lovable
1. Open your [Lovable project](https://lovable.dev/projects/ef49a6fa-de52-4a68-8434-04469122f5d6)
2. Click **Share** → **Publish**

### Deploy Manually
This is a standard Vite React application that can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## 🔗 Custom Domain

To connect a custom domain:
1. Navigate to **Project** → **Settings** → **Domains** in Lovable
2. Click **Connect Domain**
3. Follow the setup instructions

*Note: A paid Lovable plan is required for custom domains.*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏫 About GIET University

This application is designed specifically for GIET University students and staff to facilitate easy lookup of student information.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Visit [Lovable Documentation](https://docs.lovable.dev)

## 🔄 Version History

See the [commit history](../../commits) for detailed version information.

---

Built with ❤️ using [Lovable](https://lovable.dev)