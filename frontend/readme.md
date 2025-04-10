# Next.js Docker Setup

This project provides a Dockerized setup for a Next.js 15 application with pnpm, optimized for both development and production environments.

## 📂 Project Structure

```
.
├── .next/                  # Next.js build output
├── app/                    # App Router
├── components/             # React components
├── config/                 # Configuration files
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── node_modules/           # Dependencies (ignored in Docker)
├── public/                 # Static assets
├── styles/                 # Global CSS/Tailwind
├── types/                  # TypeScript types
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
├── components.json         # UI components config
├── docker-compose.dev.yml  # Dev Docker Compose
├── Dockerfile              # Production Dockerfile
├── Dockerfile.dev          # Development Dockerfile
├── k8s.env                 # Kubernetes env vars
├── local.env               # Local development env vars
├── middleware.ts           # Next.js middleware
├── next-env.d.ts           # Next.js TypeScript types
├── next.config.mjs         # Next.js config
├── package.json            # Project dependencies
├── pnpm-lock.yaml          # pnpm lockfile
├── postcss.config.mjs      # PostCSS config
├── tailwind.config.ts      # Tailwind config
└── tsconfig.json           # TypeScript config
```

## ⚙️ Setup

### 1. Prerequisites

- [Docker](https://www.docker.com/get-started) (Install)
- Node.js v23+
- pnpm (`corepack enable`)

### Development (Hot-Reloading)

```bash
docker-compose -f docker-compose.dev.yml up --build
```

- Access: [http://localhost:3000](http://localhost:3000)

- Optimized for security & performance
- Non-root user execution

## 🔧 Customization

### Environment Variables

| File      | Purpose                      |
| --------- | ---------------------------- |
| .env      | Default production variables |
| local.env | Local development overrides  |
| k8s.env   | Kubernetes-specific config   |

### Extending the Setup

- **Reverse Proxy?** Use nginx or Traefik in `docker-compose.prod.yml`.
- **Database?** Add PostgreSQL/MySQL as a service in `docker-compose.yml`.

## 📜 License

MIT

## 📌 Notes

- Hot-Reloading works via `CHOKIDAR_USEPOLLING` (required for Docker file watching).
- pnpm is used for faster, disk-efficient dependency management.
- **Security:** Production runs as a non-root user (`nextjs`).

Happy Coding! 🚀
