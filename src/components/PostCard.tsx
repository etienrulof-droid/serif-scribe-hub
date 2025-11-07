import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  featuredImageUrl?: string;
  publishedAt: string;
  readingTime: number;
  category?: string;
  slug: string;
}

export const PostCard = ({
  title,
  excerpt,
  featuredImageUrl,
  publishedAt,
  readingTime,
  category,
  slug,
}: PostCardProps) => {
  return (
    <Link to={`/post/${slug}`} className="group block">
      <article className="glass-dark rounded-xl overflow-hidden hover-scale shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-all">
        {/* Image */}
        <div className="aspect-video overflow-hidden bg-muted">
          {featuredImageUrl ? (
            <img
              src={featuredImageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>
            {category && (
              <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                {category}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold font-serif leading-tight group-hover:text-secondary transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {excerpt}
          </p>

          {/* Read More */}
          <div className="pt-2">
            <span className="text-secondary font-medium group-hover:underline">
              Read story →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};