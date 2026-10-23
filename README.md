# LifeLink — Cloud-Based Organ Donation Awareness and Registry System

A beginner-friendly college-project starter using HTML, CSS, JavaScript and Supabase.

## Run the frontend
1. Open this folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html` and select "Open with Live Server".
4. Public awareness pages work before cloud setup. Login/registration/dashboard require Supabase configuration.

## Configure Supabase
1. Create a project at https://supabase.com/.
2. In Project Settings / API, copy the Project URL and publishable key (older projects may label the public key `anon`).
3. Paste them into `js/config.js`. Never use a `service_role` or secret key in frontend code.
4. In Supabase SQL Editor, run the SQL in `supabase-schema.sql`.
5. For email confirmation, configure the project's Site URL and redirect URLs to your Live Server address and deployed website URL.

## Important security notes
- Row Level Security is enabled by the schema. Users can read and insert their own records; user updates are intentionally not granted in this starter.
- The admin page checks `app_metadata.role === "admin"` in the browser only as a display gate. The database must separately enforce admin access through a trusted `is_admin()` function/policy. Do not grant admin by letting users edit their own metadata or profile.
- Assigning `app_metadata` securely usually requires a trusted server or Supabase dashboard/admin workflow. Never expose a service-role key in frontend code.
- This is an educational expression-of-interest demo, not an official donor registry or legal consent system. Use test data only.

## Deploy
Publish this folder using Netlify (manual deploy or GitHub integration). Set the Supabase Site URL and allowed redirect URLs to your deployed domain.
