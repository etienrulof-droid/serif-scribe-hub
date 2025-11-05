-- Add is_featured column to posts table
ALTER TABLE public.posts 
ADD COLUMN is_featured boolean DEFAULT false;

-- Create index for better performance when querying featured posts
CREATE INDEX idx_posts_is_featured ON public.posts(is_featured) WHERE is_featured = true;

-- Only allow one featured post at a time (optional but recommended)
CREATE OR REPLACE FUNCTION check_single_featured_post()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_featured = true THEN
    -- Unset all other featured posts
    UPDATE public.posts 
    SET is_featured = false 
    WHERE id != NEW.id AND is_featured = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_featured_post
BEFORE INSERT OR UPDATE ON public.posts
FOR EACH ROW
WHEN (NEW.is_featured = true)
EXECUTE FUNCTION check_single_featured_post();