namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string | undefined;
    CLERK_SECRET_KEY: string | undefined;
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: string | undefined;
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: string | undefined;
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string | undefined;
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string | undefined;
    DB_USERNAME: string | undefined;
    DB_PASSWORD: string | undefined;

    NEXT_PUBLIC_URL: string | undefined;
    NEXT_PUBLIC_DOMAIN: string | undefined;
    NEXT_PUBLIC_SCHEME: string | undefined;

    UPLOADTHING_SECRET: string | undefined;
    UPLOADTHING_APP_ID: string | undefined;

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string | undefined;
    STRIPE_SECRET_KEY: string | undefined;
    STRIPE_WEBHOOK_SECRET: string | undefined;
    NEXT_PUBLIC_STRIPE_CLIENT_ID: string | undefined;
    NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT: string | undefined;
    NEXT_PUBLIC_PLATFORM_ONETIME_FEE: string | undefined;
    NEXT_PUBLIC_PLATFORM_AGENY_PERCENT: string | undefined;
    NEXT_PLURA_PRODUCT_ID: string | undefined;
    DATABASE_PASSWORD: string | undefined;

    DATABASE_URL: string | undefined;
    PROD_DATABASE_URL: string | undefined;
    NEXT_PUBLIC_BUILDER_API_KEY: string | undefined;
  }
}
