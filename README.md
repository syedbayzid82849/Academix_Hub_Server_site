Academix-Hub: Multi-Role Learning Management System (LMS)
A robust, full-stack Learning Management System built on the MERN stack, designed to support differentiated user experiences for both Learners and Instructors under a secure, tiered access model.

Deployment	Repository
Live Demo	https://academix-hub.netlify.app/
Server Code	(https://github.com/syedbayzid82849/Academix_Hub_Server_site.git)

Export to Sheets

Key Features
1. Multi-Role Functionality & Dashboards
The system implements a critical segregation of duties to manage a dual-role environment.

Instructor Workflow (CRUD): Dedicated interface for Course Management [Image 7], enabling Instructors to create, edit, and delete their proprietary content via authenticated API endpoints (/all-course routes) [Image 6, code snippet].

Learner Management: Personalized dashboard [Image 4] provides an overview of enrolled courses, recent activity, and progress tracking. Learners can manage their active commitments via the "My Enrollments" view [Image 8].

Gamification & Engagement: Tracks and displays user achievements, course completion, and quiz submissions to drive continuous user adoption [Image 4].

2. Secure Monetization and Tiered Access
The application runs on a Freemium/Tiered Subscription Model [Image 3], requiring advanced security implementation for financial transactions.

Premium Feature Toggling: Access to features like "Advanced Task Automation" is conditionally rendered and strictly enforced on the server based on the user's isPremium status.

PCI Compliant Payment: Integrated with Stripe to handle card processing via hosted checkout, ensuring zero direct handling of sensitive financial data (Tokenization).   

Webhooks for Provisioning: The user's Premium status is securely and asynchronously provisioned using a server-to-server Stripe Webhook (/api/webhook), guaranteeing access is granted only upon successful payment confirmation [code snippet].

3. Data Integrity and Reporting
Dynamic Reporting: The backend leverages MongoDB's Aggregation Pipeline (e.g., using $lookup and $group) to effectively perform complex, relational-style joins and grouping operations for reports, such as identifying the Popular Courses for display [code snippet].

Enrollment Management: Dedicated logic handles viewing and deletion of enrollment records, maintaining integrity between the users and courses collections (/myEnrolls API) [Image 8, code snippet].

⚙️ Technology Stack
Category	Technology	Key Libraries/Implementation
Frontend	React.js (SPA)	
Tailwind CSS/DaisyUI (Styling), Framer Motion, Lottie (Advanced UX)    

Backend	Node.js & Express.js	Core API layer, CORS/JSON middleware, Nodemailer (Contact form email delivery) [code snippet]
Database	MongoDB	Cloud-hosted database (MongoClient with ServerApiVersion.v1) for data persistence [code snippet]
Authentication	Firebase (Client) + Custom Role Logic (Server)	Hybrid authentication approach, managing user sessions and identity
Payments	Stripe	Stripe SDK for checkout creation, Webhooks for subscription provisioning [code snippet]
Testing	Jest	Framework for automated Unit Testing (Client-side) [code snippet]
🔒 Architectural Highlights
1. Role-Based Access Control (RBAC)
Principle of Least Privilege: Security is enforced via Server-Side Authorization Middleware to validate the user's identity and role against every sensitive API request (e.g., course creation).   

Object-Level Security: Instructors are restricted to only perform PATCH and DELETE operations on courses where their instructorEmail matches the course record, preventing unauthorized content modification.   

2. DevOps and Code Quality
CI/CD Ready: The project foundation is built for automated delivery, using version control with Git and prepared for integration with platforms like Vercel/Netlify (for frontend) and GitHub Actions (for server deployment).   

Testing Strategy: Unit testing implemented with Jest [code snippet] forms the base, complemented by best practices for Component Testing (e.g., React Testing Library) and planning for End-to-End (E2E) testing using frameworks like Playwright for critical business workflows.   

3. Scalable Content Delivery
To ensure high Quality of Experience (QoE) for multimedia, the architecture accounts for a dedicated video infrastructure:

Video Processing Pipeline: Raw instructor uploads are routed for asynchronous Transcoding to multiple resolutions (e.g., 1080p, 720p).

Global Distribution: Processed content is delivered via a Content Delivery Network (CDN), utilizing Adaptive Bitrate (ABR) streaming to minimize buffering and optimize playback based on the user's bandwidth.   

🛠️ Installation and Setup
To run the Academix-Hub platform locally, you will need Node.js/npm installed.

1. Environment Configuration
Create a .env file in the root of the Server directory and populate it with the necessary credentials:bash PORT=3000 MONGODB_URI="<Your-MongoDB-Atlas-Connection-String>" STRIPE_SECRET_KEY="<Your-Stripe-Secret-Key>" STRIPE_WEBHOOK_SECRET="<Your-Stripe-Webhook-Signing-Secret>" FRONTEND_URL="http://localhost:5173" # Or your client's local URL

Nodemailer configuration
EMAIL_USER="<Your-Admin-Email>" EMAIL_PASS="<Your-Admin-Email-App-Password>"


### 2. Setup and Run

| Step | Server (Backend) | Client (Frontend) |
| :--- | :--- | :--- |
| **1. Clone Repos** | `git clone https://github.com/syedbayzid82849/Academix_Hub_Server_site.git` | (Clone your client repository) |
| **2. Install** | `cd Academix_Hub_Server_site` then `npm install` | `cd academix-hub-client` then `npm install` |
| **3. Run** | `npm start` (or `npm dev` if using nodemon) | `npm run dev` |

The server will typically run on `http://localhost:3000`, and the client will run on its configured development port (e.g., `http://localhost:5173`).