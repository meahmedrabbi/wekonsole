# WeKonsole 🖥️

A modern, mobile-first Linux server management dashboard built with Next.js 16 and Material UI. Designed to be a powerful and user-friendly alternative to cPanel.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![MUI](https://img.shields.io/badge/MUI-v7-007FFF?style=flat-square&logo=mui)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-Apache%202.0-green?style=flat-square)

## ✨ Features

- **Modern Dashboard UI** - Clean, professional interface with dark/light theme support
- **Mobile-First Design** - Fully responsive, optimized for all screen sizes
- **Real-time Monitoring** - Live server stats (CPU, Memory, Disk, Network)
- **Service Management** - Start, stop, and restart system services
- **Quick Actions** - One-click operations for common tasks
- **Notifications System** - Stay informed about server events
- **Modular Architecture** - Clean, maintainable codebase

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [Material UI (MUI) v7](https://mui.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling**: Tailwind CSS + MUI Theme
- **Font**: Inter (Google Fonts)
- **Language**: TypeScript

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wekonsole.git

# Navigate to the project
cd wekonsole

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── backups/           # Backup management
│   ├── databases/         # Database management
│   ├── files/             # File manager
│   ├── logs/              # System logs
│   ├── network/           # Network configuration
│   ├── security/          # Security settings
│   ├── server/            # Server overview
│   ├── settings/          # Application settings
│   ├── users/             # User management
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page
├── components/
│   ├── common/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/            # Layout components (Sidebar, Header)
│   └── providers/         # Context providers
├── lib/                   # Utility functions and constants
├── store/                 # Zustand state management
├── theme/                 # MUI theme configuration
└── types/                 # TypeScript type definitions
```

## 🎨 Design Principles

- **Mobile-First**: All components designed for mobile devices first
- **Accessibility**: WCAG compliant with proper ARIA attributes
- **Performance**: Optimized bundle size and lazy loading
- **Clean Code**: Modular, reusable components with proper typing

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔮 Roadmap

- [ ] Real server data integration
- [ ] File manager implementation
- [ ] Database management UI
- [ ] User authentication system
- [ ] SSL certificate management
- [ ] Backup scheduling
- [ ] Docker container management
- [ ] API documentation

## 📄 License

Licensed under the [Apache License 2.0](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ for the Linux community
