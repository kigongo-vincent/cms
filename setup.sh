#!/bin/bash

set -e  # Exit immediately if any command fails

echo "======================= Backend Setup ========================"

# Check if Python is installed
if command -v py &> /dev/null; then
    PYTHON_CMD=py
elif command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
elif command -v python &> /dev/null; then
    PYTHON_CMD=python
else
    echo "❌ Python is not installed. Please install Python from https://www.python.org/downloads/"
    exit 1
fi

# Move to backend directory
if [ -d "backend" ]; then
    cd backend
else
    echo "❌ Error: 'backend' directory not found. Make sure you're at the root of the project."
    exit 1
fi

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    $PYTHON_CMD -m venv venv
else
    echo "Virtual environment already exists."
fi

# Activate virtual environment
echo "Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Confirm activation
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "❌ Failed to activate virtual environment."
    exit 1
fi

# Install backend dependencies
echo "Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run Django migrations
echo "Applying Django migrations..."
$PYTHON_CMD manage.py makemigrations app
$PYTHON_CMD manage.py migrate

# Create Django superuser non-interactively
echo "Creating Django superuser..."
echo "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(email='admin@gmail.com').exists():
    User.objects.create_superuser('admin@gmail.com', 'admin@gmail.com', 'Admin@2025')
" | $PYTHON_CMD manage.py shell

cd ..

echo "======================= Frontend Setup ========================"

# Move to frontend directory
if [ -d "frontend" ]; then
    cd frontend
else
    echo "❌ Error: 'frontend' directory not found."
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install --force

cd ..

echo "======================= Final Instructions ========================"
echo "✅ Setup complete."

# Check for Git
if ! command -v git &> /dev/null; then
    echo "⚠️ Git is not installed. Please install Git from https://git-scm.com/downloads to run ./run.sh"
else
    echo "Now run your application with: ./run.sh (in Git Bash or compatible terminal)"
fi

echo "🔗 Frontend: http://localhost:5173"
echo "🔐 Admin Panel: http://localhost:8000/admin"
