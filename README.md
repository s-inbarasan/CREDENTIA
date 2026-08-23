# ForgeAI

ForgeAI is a focused personal AI generation workspace for image creation. It is designed around a **bring-your-own-key** workflow: choose a provider and model, compose a prompt, generate through a server-side adapter, and keep a private history of the resulting frames.

The current implementation ships with NVIDIA NIM as the first provider. The UI and model registry are provider-agnostic so additional adapters can be added without scattering provider-specific logic across the product.

## Product surface

The workspace includes a dark-first generation composer, prompt character counting, optional enhancement, reference-image upload, model-aware controls, honest indeterminate generation states, full-size result viewing, download and prompt reuse actions, local generation history, a searchable archive, model capability cards, API-key management, email/password authentication through Supabase, and usage-limit disclosure.

The initial NVIDIA catalog is based on the current official API references for **FLUX.2 klein 4B**, **FLUX.1 dev**, and **FLUX.1 Kontext dev**.[^1] [^2] [^3] Unsupported providers are intentionally shown as future adapter targets rather than implemented through guessed endpoints.

## Architecture

```text
React + Vite UI
      |
      |  /api/generate and /api/providers/nvidia/*
      v
Express server routes
      |
      v
NVIDIA adapter payload builder
      |
      v
NVIDIA NIM hosted inference
```

The browser does not call NVIDIA directly. Provider requests are made in `server.ts`, and raw provider errors are mapped to human-readable messages. The current local credential vault encrypts saved keys in server memory using AES-256-GCM. For production persistence, connect the route to an encrypted Supabase-backed secret store and provide a strong `FORGEAI_CREDENTIAL_SECRET` value through the deployment secret manager. The included `supabase_forgeai.sql` provides user-owned tables and RLS policies for that persistence layer.

## Local setup

Install dependencies and create a local environment file:

```bash
npm install
cp .env.example .env
```

Configure the server-side NVIDIA key if you want a deployment-level default, or leave it blank and enter a user-owned key through the API Keys screen:

```env
NVIDIA_API_KEY=
FORGEAI_CREDENTIAL_SECRET=replace-with-a-long-random-secret
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Start the development server:

```bash
npm run dev
```

The application runs at `http://localhost:3000`. Build and type-check before deployment:

```bash
npm run build
npm run lint
```

If Supabase is enabled, run `supabase_forgeai.sql` in the Supabase SQL editor. The policies scope credentials, generations, saved prompts, and settings to `auth.uid() = user_id`.

## NVIDIA behavior

The adapter uses the official endpoint family at `https://ai.api.nvidia.com/v1/genai/black-forest-labs/`. FLUX.2 klein 4B uses the verified `prompt`, `width`, `height`, `seed`, and `steps` fields, with reference editing sent only when a reference image is attached. FLUX.1 dev uses its documented `base` mode, `cfg_scale`, and step range. FLUX.1 Kontext dev uses the documented image-editing request shape and aspect-ratio values.

The **Test connection** action sends a minimal verification generation request through the same server-side provider path. Depending on the NVIDIA account and plan, provider usage or rate limits may apply. ForgeAI makes no claim that provider usage is unlimited or permanently free.

## Security notes

Real secrets must never be committed to Git, placed in `VITE_` variables, returned in full to the client, written into generation history, or logged. The frontend only receives connection state and masked-key messaging. The checked-in `.env.example` contains no real secret.

The included in-memory vault is appropriate for local development and a single running process. A production deployment should replace it with encrypted, user-scoped Supabase persistence, use a strong secret manager-backed encryption key, and pass authenticated user context into the server routes.

## Verification

The current repository passes the production Vite build and TypeScript check. Browser verification covered the generation workspace, prompt validation without credentials, API-key management view, model registry and filters, settings disclosure, and mobile-ready layout rules. No placeholder image is presented as a generated result; the output canvas remains empty until NVIDIA returns a real artifact.

## References

[^1]: [NVIDIA API Reference — FLUX.2 klein 4B Infer](https://docs.api.nvidia.com/nim/reference/black-forest-labs-flux_2-klein-4b-infer)
[^2]: [NVIDIA API Reference — FLUX.1 dev Infer](https://docs.api.nvidia.com/nim/reference/black-forest-labs-flux_1-dev-infer)
[^3]: [NVIDIA API Reference — FLUX.1 Kontext dev Infer](https://docs.api.nvidia.com/nim/reference/black-forest-labs-flux_1-kontext-dev-infer)
