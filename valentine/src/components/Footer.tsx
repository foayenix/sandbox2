import { siteConfig } from "../config";

export default function Footer() {
  return (
    <footer className="py-10 text-center">
      <p className="text-blush-400 text-sm font-light">
        Made with love by {siteConfig.yourName} 💕
      </p>
    </footer>
  );
}
