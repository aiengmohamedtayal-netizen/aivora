# API Contract Specification: Aivora Platform MVP

## 1. Leads Submission Endpoint
- **URL**: `/api/v1/leads`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Request Body (JSON Schema)**:
  ```json
  {
    "type": "object",
    "properties": {
      "name": { "type": "string", "minLength": 2 },
      "email": { "type": "string", "format": "email" },
      "company": { "type": "string" },
      "message": { "type": "string", "minLength": 10 }
    },
    "required": ["name", "email", "message"]
  }
  ```
- **Responses**:
  - `201 Created`: lead saved successfully.
  - `400 Bad Request`: invalid body structure (validation error payload).
  - `429 Too Many Requests`: rate limit exceeded.

## 2. AI Chatbot Completion Endpoint (FastAPI Microservice)
- **URL**: `/api/v1/ai/chat`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "message": "string",
    "session_id": "uuid"
  }
  ```
- **Responses**:
  - `200 OK`: streaming tokens response (Server-Sent Events / Text stream).
  - `400 Bad Request`: invalid payload or prompt injections detected.
  - `429 Too Many Requests`: rate limit exceeded.
