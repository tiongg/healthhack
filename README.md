## Setup

`.env`

```
BACKEND_PORT=
FRONTEND_URL=
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
```

`./frontend/.env`

```
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
VITE_BACKEND_URL=
```

## Running the app

Frontend:

```bash
cd frontend
deno task dev
```

Backend:

```bash
deno run -A backend/server.ts
```
