#!/bin/bash
# ==============================================================================
# Payment Collection App - AWS EC2 Setup Script (MySQL Version)
# Run this script on a fresh Ubuntu 22.04 EC2 instance to configure the server.
# ==============================================================================

set -e

echo "🚀 Starting server setup..."

# 1. Update packages
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# 2. Install Node.js 18.x (if not installed)
if ! command -v node &> /dev/null; then
    echo "🟢 Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js is already installed ($(node -v)). Skipping installation."
fi

# 3. Install PM2
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# 4. Install MySQL Server (if not installed)
if ! command -v mysql &> /dev/null; then
    echo "🐬 Installing MySQL Server..."
    sudo apt-get install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
else
    echo "✅ MySQL is already installed. Skipping installation."
fi

# Create database and user for the application
echo "🛠️ Configuring MySQL Database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS payment_collection_db;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'loanuser'@'localhost' IDENTIFIED BY 'loanpassword123';"
sudo mysql -e "GRANT ALL PRIVILEGES ON payment_collection_db.* TO 'loanuser'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 5. Clone Repository
echo "📥 Cloning backend repository..."
cd /home/ubuntu
if [ ! -d "loan-payment-backend" ]; then
    git clone https://github.com/abhishekjohney/loan-payment-backend.git
fi
cd loan-payment-backend

# 6. Install dependencies
echo "📦 Installing npm dependencies..."
npm ci --production

# 7. Configure Environment Variables
echo "🔧 Setting up environment variables..."
cat <<EOF > .env
PORT=5000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=payment_collection_db
DB_USER=loanuser
DB_PASSWORD=loanpassword123
FRONTEND_URL=*
EOF

# 8. Run Database Migrations
echo "🧱 Running database migrations..."
npm run migrate

# 9. Start Application with PM2
echo "🚀 Starting Node.js application via PM2..."
pm2 start src/app.js --name loan-backend
pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

# 10. Install and Configure Nginx
echo "🌐 Installing and configuring Nginx..."
sudo apt-get install -y nginx

sudo tee /etc/nginx/sites-available/loan-api > /dev/null <<EOF
server {
    listen 80;
    server_name _; # Accept any IP/domain

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/loan-api /etc/nginx/sites-enabled/
# Remove default nginx config to prevent conflicts
sudo rm -f /etc/nginx/sites-enabled/default

# Restart Nginx
sudo nginx -t && sudo systemctl restart nginx

echo "✅ Setup complete! The backend API should now be accessible via your EC2 public IP."
