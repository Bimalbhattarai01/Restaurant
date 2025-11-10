import LoginForm from "@/components/auth/LoginForm";

interface AuthPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const resolvedParams = await searchParams;
  const destination = resolvedParams?.redirect || "/dashboard";

  return <LoginForm redirectTo={destination} />;
}
