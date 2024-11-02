import Link from "next/link";

export const SiteFooter = () => {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 bottom-0 h-8">
      <p>
        Made with ❤️ by{" "}
        <a
          href="https://ajhenry.com"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          ajhenry
        </a>
      </p>
      <Link href="/privacy">Privacy Policy</Link>
      <Link href="/terms">Terms</Link>
    </footer>
  );
};
