# NEXUS Task Manager

A full-stack task and project management dashboard built with **Next.js**, **TypeScript**, **Supabase Auth**, **PostgreSQL**, and **Drizzle ORM**.

NEXUS helps teams manage projects, assign tasks, track due dates, update work status, and monitor progress through a clean workspace-style dashboard.

---

## Features

- User authentication with Supabase
- Secure login and signup pages
- Protected dashboard route
- Role-based access for `ADMIN` and `MEMBER` users
- Create projects and tasks from the admin panel
- Assign tasks to team members
- Update task status as `PENDING`, `IN_PROGRESS`, or `COMPLETED`
- Search and filter tasks by status
- Overdue task detection
- Project progress tracking
- Task analytics with chart visualization
- Responsive workspace UI with modern animations and toast notifications

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| UI | React, Tailwind CSS, shadcn/ui-style components |
| Authentication | Supabase Auth |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | Sonner |

---

## Project Structure

```bash
nexus-task-manager/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── actions.ts
│   ├── dashboard/
│   │   ├── actions.ts
│   │   ├── admin-controls.tsx
│   │   ├── console-layout.tsx
│   │   ├── page.tsx
│   │   ├── project-list.tsx
│   │   ├── task-chart.tsx
│   │   └── task-list.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
├── db/
│   ├── index.ts
│   └── schema.ts
├── lib/
│   └── supabase/
├── public/
├── package.json
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/parnaray09-hub/nexus-task-manager.git
cd nexus-task-manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Create a `.env.local` file in the root folder and add the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_postgres_database_connection_url
```

You can get the Supabase URL and anon key from your Supabase project settings.

---

## Database Setup

The project uses PostgreSQL tables for profiles, projects, and tasks.

Run the following SQL in your Supabase SQL editor:

```sql
create extension if not exists "pgcrypto";

DO $$
BEGIN
  CREATE TYPE user_role AS ENUM ('ADMIN', 'MEMBER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
  CREATE TYPE task_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  role user_role NOT NULL DEFAULT 'MEMBER',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  assignee_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status task_status NOT NULL DEFAULT 'PENDING',
  due_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

To make a user an admin, update their role after signup:

```sql
UPDATE profiles
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';
```

---

## Run the Project

Start the development server:

```bash
npm run dev
```

Open the app in your browser:

```bash
http://localhost:3000
```

The home page redirects users to the login page.

---

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Build the production app
npm run start    # Start the production server
npm run lint     # Run ESLint
```

---

## User Roles

### Admin

Admins can:

- Create new projects
- Create and assign tasks
- View admin settings
- Update task status

### Member

Members can:

- View assigned work
- Search and filter tasks
- Update tasks assigned to them
- Track project and task progress

---

## Main Workflow

1. A user creates an account or logs in.
2. The dashboard loads projects, profiles, and tasks from the database.
3. Admin users can create projects and assign tasks.
4. Assigned users can update task progress.
5. The dashboard shows task metrics, overdue work, and project progress.

---

## Future Improvements

- Add task delete and edit options
- Add project edit and archive features
- Add invite-based team onboarding
- Add comments or activity logs for tasks
- Add priority labels for tasks
- Add file attachments for projects
- Add deployment configuration notes

---

## Author

**Parna Ray**

GitHub: `parnaray09-hub`

---

## License

No license has been specified for this project yet.
