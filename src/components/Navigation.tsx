import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, Mail, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/40 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-serif">Europees Transport</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-secondary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-foreground hover:text-secondary transition-colors">
              Over ons
            </Link>
            <a 
              href="mailto:info@puntlogistics.nl"
              className="flex items-center gap-2 text-foreground hover:text-secondary transition-colors"
            >
              <Mail className="h-5 w-5" />
              Mail ons
            </a>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Link to="/admin" className="text-foreground/50 hover:text-foreground/70 transition-colors text-sm">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-3 animate-fade-in">
            <Link
              to="/"
              className="block py-2 text-foreground hover:text-secondary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 text-foreground hover:text-secondary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Over ons
            </Link>
            <a
              href="mailto:info@puntlogistics.nl"
              className="flex items-center gap-2 py-2 text-foreground hover:text-secondary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Mail className="h-5 w-5" />
              Mail ons
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="justify-start gap-2 w-full"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-5 w-5" />
                  <span>Licht modus</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5" />
                  <span>Donker modus</span>
                </>
              )}
            </Button>
            <Link
              to="/admin"
              className="block py-2 text-foreground/50 hover:text-foreground/70 transition-colors text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};