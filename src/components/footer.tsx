import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="max-w-screen-2xl mx-auto px-4 flex flex-col items-center gap-4">
        {/* Branding */}
        <Link href="#">
          <span className="sr-only">MindEase</span>
          <p className="text-xl font-extrabold tracking-tight text-foreground">
            MindEase
          </p>
        </Link>

        {/* Description */}
        <p className="text-center text-sm text-muted-foreground px-4">
          This project is created for academic purposes<br />
          © 2025 Doni Wicaksono
        </p>

        {/* Links */}
        <div className="flex flex-wrap justify-center items-center gap-6">
          <Link
            href="https://github.com/slashedzer0"
            target="_blank"
            className="text-sm font-medium underline transition-all hover:text-muted-foreground"
          >
            GitHub
          </Link>

          {/* Separator */}
          <div className="hidden md:block h-5 w-px bg-foreground/30"></div>

          <Link
            href="mailto:doniwicaksonox@gmail.com"
            target="_blank"
            className="text-sm font-medium underline transition-all hover:text-muted-foreground"
          >
            Contact
          </Link>

          {/* Separator */}
          <div className="hidden md:block h-5 w-px bg-foreground/30"></div>

          <Link
            href="https://doniwicaksono.me"
            target="_blank"
            className="text-sm font-medium underline transition-all hover:text-muted-foreground"
          >
            Website
          </Link>
        </div>
      </div>
    </footer>
  );
}