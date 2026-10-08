import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-4xl">Page not found</h1>
      <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
        We couldn&apos;t find what you were looking for.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
