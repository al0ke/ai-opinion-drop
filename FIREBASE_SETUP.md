# Firebase Setup Guide for AI Opinion Drop

## Quick Setup (5 minutes)

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create Project"
3. Name it: `ai-opinion-drop`
4. Enable Google Analytics (optional)
5. Click "Create"

### Step 2: Create Firestore Database
1. In Firebase Console, click "Firestore Database" on left sidebar
2. Click "Create Database"
3. Choose "Start in test mode" (allows reads/writes for 30 days)
4. Select a region close to you (us-central recommended)
5. Click "Enable"

### Step 3: Get API Keys
1. Go to Project Settings (gear icon) → General
2. Scroll to "Your apps" → Click "</>" (web icon)
3. Register app: name it "ai-opinion-drop"
4. Copy the `firebaseConfig` values

### Step 4: Set Environment Variables in Vercel

Add these environment variables in your Vercel dashboard:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

Or use Vercel CLI:
```bash
cd /Users/b0lt/.openclaw/workspace/ai-opinion-drop
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# ... add all 6 variables
```

### Step 5: Redeploy
```bash
vercel --prod
```

## Features After Setup

✅ **Real-time sync** — All opinions appear instantly on every device
✅ **Live connection indicator** — Shows "🔴 Live Sync Active" when connected
✅ **Persistent storage** — Opinions survive page refreshes
✅ **Delete button** — Remove accidental entries
✅ **Live stats** — Counts update in real-time

## Security Note

Test mode allows anyone to read/write for 30 days. For long-term use:
1. Go to Firestore Database → Rules
2. Update rules to restrict access
3. Or enable Firebase Authentication

## Troubleshooting

- **"Connection Issue"**: Check API keys are correct
- **Opinions not syncing**: Check browser console for errors
- **Empty list**: Make sure Firestore database is created

---

*Setup time: ~5 minutes | Sync: Instant across all devices* ⚡
