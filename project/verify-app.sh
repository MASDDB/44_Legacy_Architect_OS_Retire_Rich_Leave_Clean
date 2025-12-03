#!/bin/bash

echo "================================"
echo "Application Health Check"
echo "================================"
echo ""

# Check Node.js
echo "1. Node.js version:"
node --version

# Check npm
echo ""
echo "2. npm version:"
npm --version

# Check if node_modules exists
echo ""
echo "3. Dependencies installed:"
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules directory exists"
    MODULE_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
    echo "   📦 $MODULE_COUNT modules installed"
else
    echo "   ❌ node_modules directory missing"
    echo "   Run: npm install"
fi

# Check critical files
echo ""
echo "4. Critical files:"
FILES=("src/index.jsx" "src/App.jsx" "src/Routes.jsx" "index.html" ".env" "package.json")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (MISSING)"
    fi
done

# Check environment variables
echo ""
echo "5. Environment configuration:"
if [ -f ".env" ]; then
    if grep -q "VITE_SUPABASE_URL=https://" .env; then
        echo "   ✅ Supabase URL configured"
    else
        echo "   ❌ Supabase URL missing or invalid"
    fi

    if grep -q "VITE_SUPABASE_ANON_KEY=" .env && [ $(grep "VITE_SUPABASE_ANON_KEY=" .env | wc -c) -gt 50 ]; then
        echo "   ✅ Supabase Anon Key configured"
    else
        echo "   ❌ Supabase Anon Key missing or invalid"
    fi
else
    echo "   ❌ .env file not found"
fi

# Check if dev server is running
echo ""
echo "6. Development server status:"
if lsof -i :5173 > /dev/null 2>&1; then
    echo "   ✅ Dev server is running on port 5173"
    echo "   🌐 Access at: http://localhost:5173"
else
    echo "   ❌ Dev server is NOT running"
    echo "   Run: npm start"
fi

# Check last build
echo ""
echo "7. Build status:"
if [ -d "build" ]; then
    BUILD_TIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" build 2>/dev/null || stat -c "%y" build 2>/dev/null | cut -d'.' -f1)
    echo "   ✅ Build directory exists"
    echo "   ⏰ Last built: $BUILD_TIME"
else
    echo "   ℹ️  No build directory (run 'npm run build' if needed)"
fi

echo ""
echo "================================"
echo "Health Check Complete"
echo "================================"
echo ""
echo "Next steps:"
echo "  1. If dev server is not running: npm start"
echo "  2. Open http://localhost:5173 in your browser"
echo "  3. Check browser console (F12) for any errors"
