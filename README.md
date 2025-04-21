# Skincare Routine Builder

A comprehensive multi-step form application that helps users create personalized skincare routines based on their skin type, goals, and preferences. This project demonstrates a robust implementation of a multi-step form with conditional logic, state persistence, and backend document processing.

## 🌟 Features

- **Multi-Step Form**: Interactive questionnaire with 12+ steps to gather user preferences
- **Conditional Logic**: Dynamic form flow based on user selections
- **State Management**: Persistent form state using Zustand and localStorage
- **Validation**: Schema-based validation with Zod
- **Document Generation**: Backend processing to create personalized PDF documents
- **Digital Signatures**: Support for adding signatures to generated documents
- **Webhooks**: Integration with external systems via webhooks

## 🛠️ Tech Stack

### Frontend
- **React + Vite**: For a fast, modern UI
- **TypeScript**: For type safety
- **Zustand**: For global state management
- **React Hook Form**: For form handling
- **Zod**: For schema validation
- **Tailwind CSS**: For styling
- **Framer Motion**: For animations
- **Shadcn UI**: For UI components

### Backend
- **FastAPI**: For the API server
- **SQLite**: For data storage
- **Python**: For document processing
- **Docker**: For containerization and deployment

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Docker and Docker Compose (for full-stack deployment)

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Development
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload
```

### Docker Deployment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📚 Documentation

For detailed documentation, see the [docs](./docs) directory:

- [Frontend Architecture](./docs/frontend.md)
- [Backend Architecture](./docs/backend.md)
- [Form Flow & Conditional Logic](./docs/form-flow.md)
- [Docker Deployment](./docs/deployment.md)

## 🔍 How It Works

1. **User Journey**: Users navigate through a series of questions about their skin type, concerns, and preferences
2. **State Management**: Each step's data is stored in Zustand state with localStorage persistence
3. **Form Submission**: On completion, data is sent to the backend API
4. **Document Generation**: Backend processes the data to generate personalized PDF documents
5. **Digital Signature**: Users can sign the generated documents
6. **Webhook Integration**: Data and document URLs are sent to external systems via webhooks

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 About the Author

Built with ❤️ by [Matija Žiberna](https://buildwithmatija.com/)
