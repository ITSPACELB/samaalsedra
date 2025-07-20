interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_WEATHER_API_KEY: string;
  readonly BASE_URL: string; // ✅ أضفنا هيدا السطر
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
