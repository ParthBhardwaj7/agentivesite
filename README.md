# Agentive - AI-Powered Solutions Platform

A modern, full-stack web application for managing and showcasing AI agents. Built with Next.js 15, React 19, TypeScript, and SQLite.

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey)

## 🚀 Features

### User Features
- **AI Agents Showcase**: Browse and explore different AI agents with detailed information
- **User Authentication**: Secure signup and login system with bcrypt password hashing
- **Contact Form**: Submit inquiries and messages directly from the website
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Dark Mode**: Optimized dark theme interface
- **Video Integration**: Watch agent demonstrations and tutorials

### Admin Features
- **Admin Panel**: Comprehensive dashboard for managing all aspects of the platform
- **Agent Management**: Create, edit, and delete AI agents
- **Message Management**: View and manage contact form submissions
- **Video Management**: Upload and manage agent demonstration videos
- **Settings Configuration**: Customize site settings and preferences
- **Real-time Updates**: See changes reflected immediately

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **SQLite3** - Lightweight database
- **bcryptjs** - Password hashing
- **Node.js** - Runtime environment

### Database
- **SQLite** - File-based database stored in `data/nexusagents.db`

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Agentic Ai"
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
   Navigate to `http://localhost:3000`

## ⚙️ Configuration

### Database Setup

The database is automatically initialized on first run. The SQLite database file will be created at:
```
data/nexusagents.db
```

### Default Admin User

To create the default admin user, visit:
```
http://localhost:3000/api/setup-default-user
```

**Admin Credentials:**
- Email: `admin@agentive.ai`
- Password: `admin123`

⚠️ **Important**: Change the default password after first login!

## 📖 Usage

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Clean build artifacts
npm run clean
```

### Admin Panel Access

1. **Login** with admin credentials at `/login`
2. **Navigate** to `/admin` to access the admin panel
3. **Manage** agents, messages, videos, and settings

### Adding AI Agents

1. Go to **Admin Panel** → **Agents**
2. Fill in the agent details:
   - Name
   - Type (Marketing, Sales, Support, etc.)
   - Description
   - Key Value Proposition
   - Features (comma-separated)
   - Photo URL or upload image
3. Click **"Add Agent"**

## 🗂️ Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin panel
│   │   ├── agents/         # Agent detail pages
│   │   ├── api/            # API routes
│   │   │   ├── agents/     # Agent CRUD operations
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   ├── contact/    # Contact form handling
│   │   │   └── videos/     # Video management
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   └── page.tsx        # Homepage
│   ├── components/          # React components
│   │   ├── admin/          # Admin-specific components
│   │   └── ui/             # Reusable UI components
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── LoginModalContext.tsx
│   │   └── SettingsContext.tsx
│   └── lib/                 # Utility functions
│       ├── database.ts      # Database operations
│       └── utils.ts         # Helper functions
├── public/                  # Static assets
├── data/                    # Database file (auto-generated)
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/setup-default-user` - Create default admin user

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/[id]` - Get agent by ID
- `PUT /api/agents/[id]` - Update agent
- `DELETE /api/agents/[id]` - Delete agent
- `GET /api/agents/[id]/videos` - Get agent videos

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact-messages` - Get all messages (admin)
- `PATCH /api/contact-messages` - Update message status
- `DELETE /api/contact-messages?id=[id]` - Delete message

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Create new video
- `DELETE /api/videos/[id]` - Delete video

### Settings
- `GET /api/settings` - Get all settings
- `POST /api/settings` - Update setting
- `GET /api/settings/[key]` - Get specific setting

### Upload
- `POST /api/upload` - Upload image file
- `POST /api/upload/video` - Upload video file

## 🗄️ Database Schema

### Tables
- **users** - User accounts and authentication
- **ai_agents** - AI agent information
- **agent_videos** - Agent demonstration videos
- **contact_messages** - Contact form submissions
- **subscriptions** - Newsletter subscriptions
- **services** - Service offerings
- **conversations** - User-agent conversations
- **site_settings** - Site configuration

## 🎨 Features in Detail

### Homepage
- Hero section with call-to-action
- Feature highlights
- About us section
- AI agents showcase
- Contact form modal

### Agent Pages
- Detailed agent information
- Video demonstrations
- Feature list
- Contact form for inquiries

### Admin Panel
- **Agents Management**: Full CRUD operations
- **Messages Management**: View and manage contact submissions
- **Videos Management**: Upload and organize videos
- **Settings**: Configure site-wide settings

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- SQL injection protection (parameterized queries)
- Input validation on all forms
- Admin-only access control
- Secure session management

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Currently, no environment variables are required. The database is file-based and stored locally.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run clean` - Remove build artifacts and node_modules

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🐛 Troubleshooting

### Database Issues
- Ensure the `data/` directory exists and is writable
- Delete `data/nexusagents.db` to reset the database
- Check console logs for database errors

### Login Issues
- Verify admin user exists: `/api/setup-default-user`
- Check browser console for errors
- Clear browser cache and localStorage

### Build Issues
- Run `npm run clean` and reinstall dependencies
- Ensure Node.js version is 18+ 
- Check for TypeScript errors: `npm run lint`

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React team for the UI library
- All open-source contributors

---

**Built with ❤️ using Next.js and React**
