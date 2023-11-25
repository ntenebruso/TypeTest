/// <reference types="vite/client" />

declare module "*.vue";

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_API_KEY: string;
    readonly VITE_SITE_URL: string;
}
