import Link from "next/link";

export function Branding() {
  return (
    <Link href="/">
      <span className="sr-only">MindEase</span>
      <p className="text-3xl font-extrabold tracking-tight text-foreground">
        MindEase
      </p>
    </Link>
  );
}
