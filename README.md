Insight Engine 🚀
Insight Engine is an AI-powered analytics dashboard that transforms raw sales data into actionable strategic insights. Built with Next.js and Google Gemini, it allows users to upload raw CSV files, automatically maps them to a structured database, and uses an LLM to answer questions about revenue, inventory, and customer trends.

It features a full-stack authentication system with social logins and a custom-built, secure email verification flow.

🛠 Tech Stack
Framework: Next.js 14 (App Router)

Language: TypeScript

AI: Vercel AI SDK + Google Gemini Pro

Database: PostgreSQL (via Prisma ORM)

Auth: NextAuth.js (v4) + Custom Credentials Provider

Styling: Tailwind CSS + Shadcn UI

Email: Resend API (Transactional Emails)

Parsing: PapaParse (Client-side CSV processing)

✨ Key Features
1. 🤖 AI-Driven Analytics
Natural Language Queries: Ask "What is my best-selling product?" or "Why did revenue drop in February?" and get instant answers.

Generative UI: The AI doesn't just output text; it dynamically renders Charts, Stats Cards, and Order Tables based on the context of your question.

2. 📂 Smart Data Ingestion
Drag-and-Drop Upload: Client-side CSV parsing handles large files efficiently.

AI Column Mapping: Automatically detects and maps messy CSV headers (e.g., "Sold_Price") to database schema fields (totalAmount).

Relational Mapping: Automatically links imported orders to Users and Products, handling connectOrCreate logic to prevent duplicate inventory items.

3. 🔐 Secure Authentication & Verification
Social Login: One-click sign-in with Google and GitHub.

Credentials Login: Secure Email/Password authentication using bcryptjs for hashing.

Email Verification (OTP): A custom microservice architecture for proving identity.

Generates a 6-digit cryptographic OTP.

Stores hashed tokens temporarily in PostgreSQL.

Delivers via Resend API.

Prevents unverified users from accessing critical dashboard features.

🚀 Getting Started
1. Clone & Install
Bash

git clone https://github.com/yourusername/insight-engine.git
cd insight-engine
npm install
2. Environment Variables
Create a .env file in the root directory:

Code snippet

# Database
DATABASE_URL="postgresql://user:password@host:port/db"

# Auth (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your_random_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# AI
GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"

# Email Service
RESEND_API_KEY="re_123456_your_resend_key"
3. Database Setup
Push the schema to your database:

Bash

npx prisma db push
4. Run the App
Bash

npm run dev
🧠 How It Works
The Data Pipeline
Upload: User uploads a CSV. PapaParse reads it in the browser.

Mapping: The app offers a "Wizard" UI to map CSV columns to schema fields (amount, date, status, category).

Ingestion: A Server Action (uploadOrderData) receives the JSON.

It creates a User connection (to the uploader).

It uses connectOrCreate on Products (by unique Name) to maintain a clean inventory catalog.

It saves the Order transaction.

The Verification Flow
Sign Up: User enters email/password.

API: /api/register creates the user record (unverified) and calls lib/mail.ts.

OTP Generation: A random 6-digit code is generated and saved to the VerificationToken table with a 10-minute expiry.

Email: Resend dispatches the code to the user's inbox.

Verify: User lands on /verify. Entering the code hits /api/verify, which validates the token and updates the user's emailVerified timestamp.