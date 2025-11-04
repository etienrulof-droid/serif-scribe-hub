import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-secondary transition-colors">
            Over ons
          </Link>
          <a href="mailto:info@puntlogistics.nl" className="hover:text-secondary transition-colors">
            info@puntlogistics.nl
          </a>
        </div>
      </div>
    </footer>
  );
};