# csce477-HW3

## Installation & Setup

1. **Clone the repository**:
    ```bash
    git clone <your-repository-link>
2. **Install dependencies:**:
   ```bash
   npm init -y
   npm install dotenv express bcrypt sqlite3
3. **Configure Environment Variables:**
Create a .env file in the root directory and add the following:
    ```bash
    PORT=3000
    DB_PATH=./database.sqlite
4. **Update package.json**
    ```bash
    "scripts": {
    "start": "node server.js"
    }
4. **Start server**
    ```bash
    npm start 
## Security Features

* **Secure Registration**: Users can create accounts with automatic password hashing.
* **Secure Login**: Authenticates users by comparing provided credentials against stored bcrypt hashes.
* **SQL Injection Prevention**: Uses prepared statements with parameters for all database queries.
* **Password Security**: Utilizes `bcrypt` with a salt factor of 12 to securely hash passwords.