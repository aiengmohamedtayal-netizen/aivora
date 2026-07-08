# Validation Quickstart: Aivora Platform MVP

This guide outlines the commands and verification scenarios required to validate that the Aivora platform MVP satisfies its design requirements.

## 1. Prerequisites
Ensure the local environments are installed and configured:
- Node.js (v22.0.0+)
- Python (3.12.0+)
- Docker (for local FastAPI testing)
- Valid local/testing keys for OpenAI, Supabase, and Resend configured in `.env` files.

## 2. Frontend Development & Testing
Run these commands inside the `frontend/` directory.

### Installation
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```
Navigate to:
- `http://localhost:3000/en` (English version, LTR)
- `http://localhost:3000/ar` (Arabic version, RTL)

### Run Unit and Integration Tests
```bash
npm run test
```

### Run Accessibility Audit and E2E Tests
```bash
npx playwright test
```

---

## 3. Backend Development & Testing
Run these commands inside the `backend/` directory.

### Installation
```bash
pip install -r requirements.txt
```

### Run FastAPI Server
```bash
uvicorn app.main:app --reload --port 8000
```
Navigate to `http://localhost:8000/docs` to view the interactive swagger API documentation.

### Run Backend Tests
```bash
pytest
```

---

## 4. Verification Checklists

### Dynamic i18n & RTL Verification
1. Open the dev server in your browser.
2. Click the language toggle button in the header.
3. Confirm that:
   - The route changes to `/ar`.
   - The HTML `dir` attribute changes to `"rtl"`.
   - The font family switches to Tajawal / Arabic-friendly sans-serif.
   - Standard margins and text align logically swap.

### AI Terminal Verification
1. Access the terminal sandbox component on the homepage.
2. Input: "What services does Aivora offer?"
3. Confirm a streaming, structured text completion returns from the FastAPI microservice.
4. Input: "Explain how to bake a cake."
5. Confirm the query is intercepted by the prompt shield and returns an out-of-scope response.
