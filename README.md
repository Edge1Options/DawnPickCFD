# DawnPick CFD

A decentralized Contract for Difference (CFD) trading platform built on the Internet Computer Protocol (ICP) blockchain.

test version: https://tu7ln-iiaaa-aaaac-qbjuq-cai.icp0.io/

## 🌟 Features

- **Decentralized Trading**: Trade CFDs directly on the ICP blockchain
- **Real-time Market Data**: Live price feeds and market overview
- **Portfolio Management**: Track positions and trading history
- **Responsive Design**: Modern Material-UI interface optimized for all devices
- **Wallet Integration**: Seamless connection with ICP wallets

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Material-UI
- **Blockchain**: Internet Computer Protocol (ICP)
- **Smart Contracts**: Motoko
- **Build Tool**: Webpack 5
- **Styling**: Material-UI + Custom CSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install/) (Internet Computer SDK)
- [Git](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DawnPickCFD
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create environment files based on the provided templates:

```bash
cp .env.example .env.local
```

Update the environment variables as needed.

### 4. Local Development

#### Start DFX Local Network

```bash
dfx start --background
```

#### Deploy to Local Network

```bash
dfx deploy
```

#### Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:8080`

## 🌐 Deployment

### Deploy to ICP Mainnet

#### 1. Prepare for Production

Ensure your `dfx.json` is properly configured:

```json
{
  "version": 1,
  "canisters": {
    "dawnpick_frontend": {
      "type": "assets",
      "source": ["dist"]
    }
  },
  "networks": {
    "ic": {
      "providers": ["https://ic0.app"],
      "type": "persistent"
    }
  }
}
```

#### 2. Build for Production

```bash
npm run build
```

#### 3. Deploy to Mainnet

```bash
dfx deploy --network ic
```

#### 4. Verify Deployment

After successful deployment, your application will be available at:
https://<canisterid>.ic0.app


### Alternative Deployment Scripts

Use the provided deployment scripts for convenience:

#### Frontend Only Deployment
```bash
# Linux/Mac
./deploy-frontend-only.sh

# Windows
deploy.bat
```

#### Full Production Deployment
```bash
# Linux/Mac
./deploy-production.sh

# Windows
deploy.bat
```

## 🔧 Configuration

### Environment Variables

- `.env.local` - Local development settings
- `.env.production` - Production environment settings

### DFX Configuration

The `dfx.json` file contains canister and network configurations. Key settings:

- **Frontend Canister**: Serves the React application
- **Network Configuration**: IC mainnet and local development settings

## 📁 Project Structure
DawnPickCFD/
├── src/
│   ├── components/          # React components
│   │   ├── Charts/         # Price charts and market data visualization
│   │   ├── Header/         # Navigation and wallet connection
│   │   ├── MarketData/     # Market overview and contract lists
│   │   ├── Portfolio/      # Position management and trading history
│   │   └── TradingPanel/   # Trading interface and dashboard
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styles and themes
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── canister/               # Smart contract code (Motoko)
├── dfx.json               # DFX configuration
├── package.json           # Node.js dependencies
└── webpack.config.js      # Webpack build configuration



## 🧪 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed and TypeScript types are correct
2. **DFX Connection Issues**: Check if DFX is running and network configuration is correct
3. **Wallet Connection**: Verify wallet extension is installed and enabled
4. **Bundle Size Warnings**: Consider code splitting and optimization

### Bundle Size Optimization

If you encounter bundle size warnings:

1. Use dynamic imports for large components
2. Implement code splitting
3. Optimize Material-UI imports
4. Remove unused dependencies

### TypeScript Errors

For TypeScript compilation issues:

1. Clear TypeScript cache: `rm -rf node_modules/.cache`
2. Rebuild: `npm run build`
3. Check import/export statements
4. Verify component prop types

## 📊 Performance

### Optimization Tips

- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize bundle size with code splitting
- Use service workers for caching

## 🔒 Security

### Best Practices

- Always validate user inputs
- Use HTTPS in production
- Implement proper error handling
- Keep dependencies updated

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the [ICP Developer Documentation](https://internetcomputer.org/docs/)
- Join the [ICP Developer Community](https://forum.dfinity.org/)

## 🔗 Useful Links

- [Internet Computer](https://internetcomputer.org/)
- [DFX Documentation](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 📈 Roadmap

- [ ] Advanced charting features
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced trading strategies
- [ ] Social trading features

## 🙏 Acknowledgments

- Internet Computer Protocol team
- React and Material-UI communities
- Open source contributors

---

**Built with ❤️ on the Internet Computer**