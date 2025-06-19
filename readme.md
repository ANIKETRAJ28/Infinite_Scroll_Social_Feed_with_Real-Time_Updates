# Social-Vibe

## Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ANIKETRAJ28/Social-Vibe-Backend.git
   ```
2. Navigate to the project directory:
   ```bash
    cd Social-Vibe-Backend
   ```
3. Install the required dependencies:
4. ```bash
   npm install
   ```
5. Create a `.env` file in the root directory and add your environment variables:
   ```plaintext
    PGHOSTNAME
    PGPORT
    PGDBNAME
    PGUSER
    PGPWD
    DATABASE_URL=`postgresql://${PGUSER}:${PGPWD}@${PGHOSTNAME}:${PGPORT}/${PGDBNAME}`
    PORT
    FRONTEND_URL
    SALT
    ENVIRONMENT
    JWT_SECRET
    REDIS_PORT
    REDIS_URL
    REDIS_PASSWORD
   ```
6. Migrate the database:
   ```bash
   npx prisma migrate dev
   ```
7. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
   8. Build the project:
   ```bash
   tsc
   ```
   9. Seed the database (optional):
   ```bash
    node dist/seed/index.js
   ```
8. Start the server:
   ```bash
   npm start
   ```
