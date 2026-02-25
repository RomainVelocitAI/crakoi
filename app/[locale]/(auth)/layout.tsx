import { Link } from "@/lib/i18n/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-3xl font-bold tracking-wider text-text-primary">
              CRACKO<span className="text-gold">I</span>
            </h1>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
