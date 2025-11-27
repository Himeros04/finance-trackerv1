# Environment Setup Instructions

## Creating .env.local file

Since `.env.local` is gitignored, you need to create it manually:

1. Create a new file named `.env.local` in the root directory of the project
2. Add the following content:

```
NEXT_PUBLIC_SUPABASE_URL=https://dbimynqqxevwptciyuly.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_wuVvedXRpF3Ws7dMWmqvxQ_IgjhWAcU
SUPABASE_SERVICE_ROLE_KEY=sb_secret_pIHPBbdOoQjXbB_Rcixuxw_nxuiUHfG
```

## Setting up Supabase Database

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/dbimynqqxevwptciyuly
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase-schema.sql` to create all tables and insert initial data

## Restarting the Dev Server

After creating `.env.local`, restart your dev server:

```bash
npm run dev
```

The application will now connect to your Supabase database!
