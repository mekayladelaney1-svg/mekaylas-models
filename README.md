# AI Influencer Studio

✨ **Create, manage, and showcase AI-generated influencer models with an intuitive web interface.**

## 🚀 Features

- **Create AI Models**: Design unique AI influencers with customizable attributes
  - Name
  - Hair color
  - Eye color
  - Personality type
  - Bio/Description

- **Model Management**: Full CRUD operations
  - Create new models
  - View all models in a beautiful gallery
  - Edit existing models
  - Delete models

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

- **Real-time Updates**: Models update instantly across the interface

- **Modern UI**: Built with Tailwind CSS and smooth animations

- **REST API**: Complete API for programmatic access

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## 🛠️ Installation

### Option 1: Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/mekayladelaney1-svg/mekaylas-models.git
   cd mekaylas-models
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (optional)
   ```bash
   cp .env.example .env
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Option 2: Development Mode

For development with auto-reload:

```bash
npm install
npm run dev
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Get All Models
```
GET /api/models
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Luna Chen",
      "hair": "Black",
      "eyes": "Brown",
      "personality": "Luxury",
      "bio": "Elegant and sophisticated AI influencer",
      "image": null,
      "createdAt": "2026-05-23T12:00:00Z",
      "followers": 0,
      "engagement": 0
    }
  ],
  "count": 1
}
```

#### Get Single Model
```
GET /api/models/:id
```

#### Create Model
```
POST /api/models
```

**Request Body:**
```json
{
  "name": "Luna Chen",
  "hair": "Black",
  "eyes": "Brown",
  "personality": "Luxury",
  "bio": "Elegant and sophisticated AI influencer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Luna Chen",
    "hair": "Black",
    "eyes": "Brown",
    "personality": "Luxury",
    "bio": "Elegant and sophisticated AI influencer",
    "image": null,
    "createdAt": "2026-05-23T12:00:00Z",
    "followers": 0,
    "engagement": 0
  },
  "message": "Model created successfully"
}
```

#### Update Model
```
PUT /api/models/:id
```

**Request Body:**
```json
{
  "name": "Luna Chen",
  "hair": "Black",
  "eyes": "Brown",
  "personality": "Luxury",
  "bio": "Updated bio"
}
```

#### Delete Model
```
DELETE /api/models/:id
```

#### Health Check
```
GET /api/health
```

## 🎨 Customization

### Change Port
Modify the `PORT` in `.env`:
```
PORT=8080
```

### Add More Personality Types
Edit `public/index.html` and update the personality select options:
```html
<option value="NewType">🎯 New Type</option>
```

### Modify Styling
The app uses Tailwind CSS. Edit `public/styles.css` for custom styles.

## 🗄️ Database

Currently, the app uses in-memory storage (models are cleared when the server restarts). For production:

### To add persistence, install a database:

```bash
# MongoDB
npm install mongodb

# PostgreSQL
npm install pg

# SQLite
npm install sqlite3
```

Then update `server.js` to use the database.

## 📦 Project Structure

```
mekaylas-models/
├── public/
│   ├── index.html          # Main UI
│   ├── app.js              # Frontend logic
│   └── styles.css          # Custom styles
├── server.js               # Express server
├── package.json            # Dependencies
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🔒 Security Features

- ✅ Input validation on both client and server
- ✅ XSS protection with HTML escaping
- ✅ CORS enabled for safe cross-origin requests
- ✅ Error handling without exposing sensitive info
- ✅ Request size limits to prevent abuse

## 🚀 Deployment

### Deploy to Heroku

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### Deploy to Railway

1. **Connect repository**
   ```bash
   railway link
   ```

2. **Deploy**
   ```bash
   railway up
   ```

## 🐛 Troubleshooting

### Port already in use
```bash
# Change the port in .env or use:
PORT=8080 npm start
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Can't connect to localhost:3000
- Ensure the server is running
- Check if port 3000 is accessible
- Try `http://127.0.0.1:3000` instead

## 📖 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [REST API Best Practices](https://restfulapi.net/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Mekayla Delaney

## 💬 Support

For issues and questions, please open a GitHub issue.

---

**Happy creating! ✨**
