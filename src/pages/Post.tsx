import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PostData {
  id: string;
  title: string;
  content: string;
  featured_image_url?: string;
  published_at: string;
  reading_time: number;
  author?: {
    full_name: string;
    avatar_url?: string;
    bio?: string;
  };
  categories?: { name: string; slug: string }[];
  tags?: { name: string; slug: string }[];
}

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          categories:post_categories(category:categories(*)),
          tags:post_tags(tag:tags(*))
        `)
        .eq("slug", postSlug)
        .eq("status", "published")
        .single();

      if (error) throw error;

      if (data) {
        // Fetch author separately
        const { data: authorData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.author_id)
          .single();

        setPost({
          ...data,
          author: authorData || undefined,
          categories: data.categories?.map((pc: any) => pc.category),
          tags: data.tags?.map((pt: any) => pt.tag),
        });

        // Increment view count
        await supabase
          .from("posts")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", data.id);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = window.location.href;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold font-serif">Post not found</h2>
            <Link to="/">
              <Button>Return home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <article className="flex-1">
        {/* Hero Image */}
        {post.featured_image_url && (
          <div className="w-full h-[50vh] md:h-[60vh] overflow-hidden bg-muted">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}

        {/* Content */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.reading_time} min read
            </span>
            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2">
                {post.categories.map((cat) => (
                  <Badge key={cat.slug} variant="secondary">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight mb-8">
            {post.title}
          </h1>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 mb-12 pb-8 border-b border-border">
            <span className="text-sm font-medium">Share:</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Post Content */}
          <div
            className="prose prose-lg max-w-none 
              prose-headings:font-serif prose-headings:tracking-tight
              prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-8 prose-h1:leading-tight
              prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:leading-snug
              prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
              prose-p:leading-[1.8] prose-p:text-foreground prose-p:mb-6 prose-p:text-lg
              prose-ul:my-8 prose-ul:space-y-3 prose-li:leading-relaxed
              prose-ol:my-8 prose-ol:space-y-3
              prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-8
              prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10
              prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline
              prose-strong:font-semibold prose-strong:text-foreground
              prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
              [&>*:first-child]:mt-0"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.slug} variant="outline">
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        </div>
      </article>

      <Footer />
    </div>
  );
}