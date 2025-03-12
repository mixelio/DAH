# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```


# Dream-Project

Dream Are Here is a Django-based web application for dreamers and contributors. We managing your dream, payments, and notifications. 
## Features

- **JWT authenticated**: Secure API access with JSON Web Tokens.
- **Postgres database**
- **Cloudinary service for images**
- **Admin panel /admin/**: Access the admin panel at `/admin/`.
- **Documentation is located at /api/doc/swagger/**
- **Managing and fulfilling dreams, comments and payments**
- **"CRUD" for all dream objects for owners**
- **Email notifications**: Alerts for fulfilling your dream, change password
- **Stripe payments**: Secure online payments for borrowings.
- **Dockerized Environment**: The project is fully dockerized for easy deployment and development.

## Installation

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)

### Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/mixelio/DAH
   cd DAH

2. **Build and run docker containers:**
   ```bash
    docker build -t your_image_name .
    docker run -d -p 8000:8000 your_image_name
    ```

3. **Create a superuser**:

    ```bash
    python manage.py createsuperuser
   ```

### Usage

- **Register a user**: Use the `/api/user/register/` endpoint to register a new user.
- **Obtain tokens**: Use `/api/user/token/` to get access and refresh tokens.
- **Authenticated requests**: Include the access token in the header of your HTTP requests for authentication. Use the key "Authorize"

