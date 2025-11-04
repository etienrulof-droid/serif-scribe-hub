import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url?: string;
  published_at: string;
  reading_time: number;
  categories?: { name: string }[];
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          categories:post_categories(category:categories(*))
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedPosts = data.map((post: any) => ({
          ...post,
          categories: post.categories?.map((pc: any) => pc.category),
        }));
        setFeaturedPost(formattedPosts[0]);
        setPosts(formattedPosts.slice(1));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight">
              Europees transport
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Actueel nieuws en inzichten over Europees wegtransport
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-md mx-auto pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Zoek artikelen..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="default">Zoeken</Button>
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mt-16 max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold font-serif mb-6">Uitgelicht artikel</h2>
              <PostCard
                id={featuredPost.id}
                title={featuredPost.title}
                slug={featuredPost.slug}
                excerpt={featuredPost.excerpt || ""}
                featuredImageUrl={featuredPost.featured_image_url}
                publishedAt={featuredPost.published_at}
                readingTime={featuredPost.reading_time}
                category={featuredPost.categories?.[0]?.name}
              />
            </div>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold font-serif mb-8">Laatste artikelen</h2>
          
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Artikelen laden...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "Geen artikelen gevonden." : "Nog geen artikelen beschikbaar."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt || ""}
                  featuredImageUrl={post.featured_image_url}
                  publishedAt={post.published_at}
                  readingTime={post.reading_time}
                  category={post.categories?.[0]?.name}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}