# MindScribe - AI Thought Capture

An ADHD-friendly application designed for frictionless thought capture. It uses AI to automatically organize your thoughts, helping you see patterns and reduce cognitive load without the burden of manual tagging.

## Critical Security Notice

This project uses the Gemini API. The API key is handled via a Vite environment variable (`import.meta.env.VITE_GEMINI_API_KEY`). This setup prevents the key from being included in version control. For a production deployment, it is **highly recommended** to use a backend proxy to further secure your API key and prevent it from being exposed in any client-side code.

## Project Setup

### Environment Variables

To run the application, create a file named `.env.local` in the root of the project. This file is ignored by git and is the secure place for your API key.

Add the following line to your `.env.local` file:
```
VITE_GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY_HERE"
```

Replace `YOUR_GOOGLE_GEMINI_API_KEY_HERE` with your actual key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running Locally

To run the application, you can open the `index.html` file in your browser. For the best development experience that handles API requests and module loading correctly, using a local web server is recommended.

If you have Python installed, you can start a simple server from the project root:
```bash
python3 -m http.server
```
Alternatively, use a tool like the Live Server extension in VS Code.

## Security Validation

After building the app (if you have a build process), you can run the following commands in your terminal from the project root to verify no secrets are exposed in the `dist` directory:
```bash
# Verify no API key values are directly in the bundle
grep -r "sk-" dist/ || echo "✅ No Google API keys in bundle"

# Verify the environment variable NAME is not in the bundle
grep -r "VITE_GEMINI_API_KEY" dist/ && echo "❌ VITE_GEMINI_API_KEY variable name found in bundle" || echo "✅ No VITE_GEMINI_API_KEY variable names in bundle"
```