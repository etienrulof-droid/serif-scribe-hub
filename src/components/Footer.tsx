import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif">Luxe Blog</h3>
            <p className="text-sm text-muted-foreground">
              Contemporary stories and insights delivered with elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                Home
              </Link>
              <Link to="/categories" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                Categories
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold">Categories</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/category/technology" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                Technology
              </Link>
              <Link to="/category/lifestyle" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                Lifestyle
              </Link>
              <Link to="/category/design" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                Design
              </Link>
              <Link to="/category/travel" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                Travel
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold">Subscribe for updates</h4>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1"
              />
              <Button variant="default">Join</Button>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Luxe Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};