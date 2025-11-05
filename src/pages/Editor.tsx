import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Editor() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image_url: "",
    featured_image_alt: "",
    status: "draft" as "draft" | "scheduled" | "published",
    scheduled_at: "",
    seo_title: "",
    seo_description: "",
    seo_image_url: "",
    reading_time: 5,
    is_featured: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (postId && userId) {
      fetchPost();
    }
  }, [postId, userId]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setUserId(user.id);
  };

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || "",
          content: data.content,
          featured_image_url: data.featured_image_url || "",
          featured_image_alt: data.featured_image_alt || "",
          status: data.status,
          scheduled_at: data.scheduled_at || "",
          seo_title: data.seo_title || "",
          seo_description: data.seo_description || "",
          seo_image_url: data.seo_image_url || "",
          reading_time: data.reading_time || 5,
          is_featured: data.is_featured || false,
        });
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.slug || generateSlug(formData.title);
      const readingTime = calculateReadingTime(formData.content);

      const postData = {
        ...formData,
        slug,
        reading_time: readingTime,
        author_id: userId,
        published_at: formData.status === "published" ? new Date().toISOString() : null,
        scheduled_at: formData.scheduled_at || null,
      };

      if (postId) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", postId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Post updated successfully.",
        });
      } else {
        const { error } = await supabase.from("posts").insert([postData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Post created successfully.",
        });
      }

      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Store preview data in sessionStorage
    sessionStorage.setItem("previewPost", JSON.stringify(formData));
    window.open("/preview", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handlePreview} className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSubmit} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save post"}
            </Button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-6 glass-dark rounded-xl p-6">
            <h2 className="text-2xl font-bold font-serif">Post Details</h2>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (!formData.slug) {
                    setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
                  }
                }}
                placeholder="Enter post title..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="post-url-slug"
              />
              <p className="text-xs text-muted-foreground">
                Preview: /post/{formData.slug || "your-slug-here"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Short description for post cards..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your post content here... You can use HTML tags for formatting."
                rows={20}
                required
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Supports HTML. The post title will be displayed as an h2 element on the public page.
              </p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-6 glass-dark rounded-xl p-6">
            <h2 className="text-2xl font-bold font-serif">Featured Image</h2>

            <div className="space-y-2">
              <Label htmlFor="featured_image_url">Image URL</Label>
              <Input
                id="featured_image_url"
                type="url"
                value={formData.featured_image_url}
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featured_image_alt">Image Alt Text</Label>
              <Input
                id="featured_image_alt"
                value={formData.featured_image_alt}
                onChange={(e) => setFormData({ ...formData, featured_image_alt: e.target.value })}
                placeholder="Describe the image for accessibility"
              />
            </div>

            {formData.featured_image_url && (
              <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                <img
                  src={formData.featured_image_url}
                  alt={formData.featured_image_alt}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Publishing */}
          <div className="space-y-6 glass-dark rounded-xl p-6">
            <h2 className="text-2xl font-bold font-serif">Publishing</h2>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === "scheduled" && (
              <div className="space-y-2">
                <Label htmlFor="scheduled_at">Schedule Date & Time</Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                />
              </div>
            )}

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label htmlFor="is_featured">Uitgelicht artikel</Label>
                <p className="text-sm text-muted-foreground">
                  Dit artikel wordt getoond als uitgelicht op de homepagina
                </p>
              </div>
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-6 glass-dark rounded-xl p-6">
            <h2 className="text-2xl font-bold font-serif">SEO Settings</h2>

            <div className="space-y-2">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="SEO optimized title (max 60 characters)"
                maxLength={60}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_description">SEO Description</Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                placeholder="Meta description (max 160 characters)"
                maxLength={160}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_image_url">Social Share Image URL</Label>
              <Input
                id="seo_image_url"
                type="url"
                value={formData.seo_image_url}
                onChange={(e) => setFormData({ ...formData, seo_image_url: e.target.value })}
                placeholder="https://example.com/share-image.jpg"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}