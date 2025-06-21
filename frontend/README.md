# Zero-Delta Euler: Integration & Testing Frontend

A production-ready Next.js frontend for testing and interacting with the Zero-Delta Euler smart contracts in real-time.

## Features

- 🚀 **Next.js 14+** with App Router and TypeScript
- 🎨 **Sleek UI** with Tailwind CSS and shadcn/ui components
- 🔗 **Full Contract Integration** via ethers.js
- 👛 **Wallet Connection** with MetaMask support
- 📊 **Real-time Metrics** from the vault and operator contracts
- 🔄 **Auto-refresh** with manual refresh option
- ⚡️ **Edge API Routes** for optimal performance
- 📝 **Direct Contract Interaction** for all major functions
- 🛡️ **Comprehensive Error Handling** and toast notifications

## Quick Start

1.  **Clone and install dependencies:**
    ```bash
    git clone <repository-url>
    cd zero-delta-euler/frontend
    npm install
    ```

2.  **Set up environment variables:**
    ```bash
    cp .env.example .env.local
    ```
   
    Edit `.env.local` with your Sepolia RPC URL:
    ```env
    SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open [http://localhost:3000](http://localhost:3000) to access the test page.**

## Environment Variables

| Variable          | Description               | Required |
| ----------------- | ------------------------- | -------- |
| `SEPOLIA_RPC_URL` | Sepolia testnet RPC endpoint | ✅       |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Architecture

- **App Router** - Next.js 14+ file-based routing
- **`useWallet` Hook** - Centralized wallet state management
- **`useMetrics` Hook** - SWR-based data fetching
- **Edge API Routes** - Optimized API endpoints for contract data
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality components
- **Sonner** - Toast notifications for user feedback

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/zero-delta-euler)

Or deploy manually:

```bash
npm run build
npm run start
```

## License

MIT License - see LICENSE file for details.
