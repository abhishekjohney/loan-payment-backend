# Payment Collection App - Backend API

This is the REST API backend for the Payment Collection App. It handles customers' personal loan details and payment records using Node.js, Express, and MySQL.

## Prerequisites

- **Node.js**: v18+
- **MySQL**: v8+ (Server running locally or remotely)
- **PM2**: (Optional, for production deployment)

---

## Local Setup

Follow these steps to run the backend locally:

1. **Clone the repository and install dependencies:**
   ```bash
   cd payment-app-backend
   npm install
   ```

2. **Configure Environment Variables:**
   Copy the example environment file and fill in your MySQL credentials:
   ```bash
   cp .env.example .env
   ```

3. **Database Setup & Seeding:**
   Ensure your MySQL server is running. Create a database named `payment_collection_db`. Then, run the automated migration and seed script:
   ```bash
   npm run migrate
   ```
   *(This will automatically create tables and insert 8 sample customers and 7 payments).*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The API will now be accessible at `http://localhost:5000/api`.

---

## API Endpoints

| Method | Endpoint | Description | Request Body Example | Response Example (Success) |
|--------|----------|-------------|----------------------|----------------------------|
| `GET` | `/api/health` | Health check endpoint | N/A | `{"success": true, "message": "API is running"}` |
| `GET` | `/api/customers` | Get all customers with loan details | N/A | `{"success": true, "data": [{ "id": 1, "customer_name": "...", "emi_due": "...", ... }]}` |
| `GET` | `/api/customers/:account` | Get a specific customer by account | N/A | `{"success": true, "data": { "account_number": "...", ... }}` |
| `POST` | `/api/payments` | Submit an EMI payment | `{"account_number": "ACC-1001", "amount": 5000}` | `{"success": true, "data": { "payment": {...}, "updatedLoanDetails": {...} }}` |
| `GET` | `/api/payments/:account` | Get payment history for an account | N/A | `{"success": true, "customer": {...}, "data": [ { "payment_date": "...", "payment_amount": "..." } ]}` |

---

## Running Tests

To run the automated test suite (Jest + Supertest):
```bash
npm test
```
*(Tests cover API routing, error handling, and model validation)*

---

## CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration and deployment.
The pipeline workflow is defined in `.github/workflows/deploy-backend.yml`.

**Workflow Steps:**
1. Triggers on pushes to the `main` branch.
2. Checks out the code and sets up Node.js 18.
3. Installs dependencies using `npm ci`.
4. Runs linters (`npm run lint`) and tests (`npm test`).
5. **Deployment**: Uses `appleboy/ssh-action` to SSH into the AWS EC2 instance, pull the latest code, install production dependencies, run migrations, and seamlessly restart the PM2 server.

**Required GitHub Secrets:**
- `EC2_HOST`: The public IP of your EC2 instance.
- `EC2_USER`: The SSH username (e.g., `ubuntu`).
- `EC2_SSH_KEY`: The private RSA/PEM key for SSH access.

---

## AWS EC2 Deployment Steps

Deploying to AWS EC2 has been simplified using the included automated setup script.

1. **Launch an EC2 Instance:** Provision a fresh Ubuntu 22.04 LTS instance and ensure ports `80` (HTTP), `443` (HTTPS), and `22` (SSH) are open in your security group.
2. **Transfer and Run Setup Script:**
   Upload the `aws-setup.sh` script to your server and run it:
   ```bash
   chmod +x aws-setup.sh
   ./aws-setup.sh
   ```
3. **What the script does:**
   - Installs Node.js 18, MySQL Server, PM2, and Nginx.
   - Configures the MySQL database and user.
   - Clones this repository and installs dependencies.
   - Configures Nginx as a reverse proxy, routing port `80` traffic to port `5000`.
   - Starts the application using PM2 to run in the background.

Once the script completes, your API will be live at `http://YOUR_EC2_PUBLIC_IP/api`.
