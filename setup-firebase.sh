#!/bin/bash
# Firebase Env Vars Setup Script for ai-opinion-drop

cd /Users/b0lt/.openclaw/workspace/ai-opinion-drop

echo "Setting up Firebase environment variables..."

# Add each env var
echo "AIzaSyApxKPWtIhL9Y-AvFDjCNksvdkQxXmrAWQ" | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
echo "ai-opinion-drop.firebaseapp.com" | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
echo "ai-opinion-drop" | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
echo "ai-opinion-drop.firebasestorage.app" | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
echo "413295234806" | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
echo "1:413295234806:web:1718bf02cdb1182b93a6d7" | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

echo "All environment variables added!"
echo "Redeploying..."
vercel --prod

echo "Done! Live sync should be active."
