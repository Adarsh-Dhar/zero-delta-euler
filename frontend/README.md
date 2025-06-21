# DeFi Dashboard

A production-ready Next.js dashboard for monitoring DeFi protocol metrics in real-time.

## Features

- 🚀 **Next.js 14+** with App Router and TypeScript
- 🎨 **Beautiful UI** with Tailwind CSS and shadcn/ui components
- 📊 **Real-time Metrics** from smart contracts via ethers.js
- 🔄 **Auto-refresh** every 15 seconds with manual refresh option
- 📱 **Responsive Design** optimized for all devices
- ⚡ **Edge API Routes** for optimal performance
- 🎭 **Smooth Animations** with Framer Motion
- ♿ **Accessibility** with semantic HTML and ARIA labels
- 🛡️ **Error Handling** with comprehensive error boundaries
- 🔧 **TypeScript** for type safety

## Quick Start

1. **Clone and install dependencies:**
   \`\`\`bash
   git clone <repository-url>
   cd nextjs-dashboard
   npm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` with your values:
   \`\`\`env
   RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
   CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
   \`\`\`

3. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open [http://localhost:3000](http://localhost:3000)**

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RPC_URL` | Ethereum RPC endpoint | ✅ |
| `CONTRACT_ADDRESS` | Smart contract address | ✅ |
| `FALLBACK_RPC_URL` | Backup RPC endpoint | ❌ |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Architecture

- **App Router** - Next.js 14+ file-based routing
- **Server Components** - Default server-side rendering
- **Edge API Routes** - Optimized API endpoints
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality components
- **Framer Motion** - Smooth animations

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/nextjs-dashboard)

Or deploy manually:

\`\`\`bash
npm run build
npm run start
\`\`\`

## License

MIT License - see LICENSE file for details.
