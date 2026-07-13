-- AL-Hurumah Project Schema

-- 1. Profiles Table (For Role Management & Ext User Data)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, address)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'address'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  category TEXT,
  image TEXT, -- এটি আপনার মেইন প্রোডাক্টের ছবি
  details JSONB DEFAULT '{"sizes": [], "volumes": [], "stock": 0, "is_latest": false, "images": []}'::jsonb, -- এই কলামে অতিরিক্ত সব ছবি এবং ডিটেইলস সেভ থাকবে
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: যদি products টেবিলটি ইতিমধ্যে তৈরি করা থাকে, তবে details কলামটিকে jsonb তে কনভার্ট করতে নিচের কুয়েরিটি রান করুন:
-- ALTER TABLE products ALTER COLUMN details SET DATA TYPE jsonb USING details::jsonb;

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products Policies
-- সকলের জন্য প্রোডাক্ট দেখার অনুমতি (Public Read Access)
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- শুধুমাত্র লগইন করা বা অথেনটিকেটেড ইউজারদের জন্য প্রোডাক্ট তৈরি, এডিট ও ডিলিট করার অনুমতি
CREATE POLICY "Allow authenticated users to insert" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON products
  FOR DELETE USING (auth.role() = 'authenticated');


-- 3. Orders Table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  total NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'Cash on Delivery',
  transaction_id TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Orders Policies
CREATE POLICY "Users can view their own orders." ON orders FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Users can insert their own orders." ON orders FOR INSERT WITH CHECK (
  auth.uid() = user_id OR auth.uid() IS NULL -- Allow guest orders
);
CREATE POLICY "Admins can update order status." ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);


-- 4. Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID DEFAULT NULL, -- removed reference to allow items to persist if product is deleted
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  selected_attr TEXT,
  image_url TEXT
);

-- Enable RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Order Items Policies
CREATE POLICY "Users can view items in their orders." ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')))
);
CREATE POLICY "Users can insert items to their orders." ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);


-- 5. Site Settings Table (Relational flat layout)
DROP TABLE IF EXISTS site_settings;

CREATE TABLE site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_settings',
  brand_name TEXT DEFAULT 'AL-Hurumah',
  categories TEXT[] DEFAULT ARRAY['Panjabi', 'Attar'],
  bkash_number TEXT DEFAULT '017XXXXXXXX',
  nagad_number TEXT DEFAULT '018XXXXXXXX',
  rocket_number TEXT DEFAULT '019XXXXXXXX',
  hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=1920',
  hero_title_line_1 TEXT DEFAULT 'Elegance in',
  hero_title_line_2 TEXT DEFAULT 'Tradition.',
  hero_description TEXT DEFAULT 'Discover our exclusive collection of premium Panjabis and authentic Attars. Crafted for elegance, designed for you.',
  footer_description TEXT DEFAULT 'Your destination for premium traditional wear and authentic fragrances. We bring you the finest Panjabis and Attars from around the world.',
  meta_pixel_id TEXT DEFAULT '',
  seo_keywords TEXT DEFAULT 'AL-Hurumah, Panjabi, Attar, Traditional Wear, Fragrances, Premium Panjabi, Authentic Attar',
  about_text_1 TEXT DEFAULT 'Founded in 2024, AL-Hurumah began with a simple yet profound vision: to bridge the gap between traditional craftsmanship and contemporary style. Our journey started in the heart of the artisan community, where we discovered the timeless beauty of hand-stitched Panjabis and the mystical allure of organic Attars.',
  about_text_2 TEXT DEFAULT 'We believe that clothing and fragrance are more than just products; they are reflections of identity and culture. That''s why we source only the finest materials—from premium Egyptian cotton to the rarest essential oils—ensuring that every piece carries the legacy of quality.',
  about_mission TEXT DEFAULT 'To preserve and promote traditional artistry by crafting premium attire and fragrances that inspire confidence and celebrate authenticity in a modern world.',
  about_vision TEXT DEFAULT 'To become a global symbol of refined traditionalism, where every thread and scent tells a story of heritage, quality, and timeless grace.',
  contact_email TEXT DEFAULT 'concierge@alhurumah.com',
  contact_phone TEXT DEFAULT '+880 1234 567890',
  contact_address TEXT DEFAULT 'Gulshan-2, Dhaka',
  contact_hours TEXT DEFAULT '10:00 AM - 09:00 PM',
  contact_image_top TEXT DEFAULT 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2000',
  contact_image_bottom TEXT DEFAULT 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Site Settings Policies
CREATE POLICY "Site settings are viewable by everyone." ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert or update site settings." ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Initial default settings seeding
INSERT INTO site_settings (
  id, brand_name, categories, bkash_number, nagad_number, rocket_number, 
  hero_image, hero_title_line_1, hero_title_line_2, hero_description, 
  footer_description, meta_pixel_id, seo_keywords, 
  about_text_1, about_text_2, about_mission, about_vision, 
  contact_email, contact_phone, contact_address, contact_hours, 
  contact_image_top, contact_image_bottom
)
VALUES (
  'global_settings', 
  'AL-Hurumah', 
  ARRAY['Panjabi', 'Attar'], 
  '017XXXXXXXX', 
  '018XXXXXXXX', 
  '019XXXXXXXX', 
  'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=1920', 
  'Elegance in', 
  'Tradition.', 
  'Discover our exclusive collection of premium Panjabis and authentic Attars. Crafted for elegance, designed for you.',
  'Your destination for premium traditional wear and authentic fragrances. We bring you the finest Panjabis and Attars from around the world.', 
  '', 
  'AL-Hurumah, Panjabi, Attar, Traditional Wear, Fragrances, Premium Panjabi, Authentic Attar',
  'Founded in 2024, AL-Hurumah began with a simple yet profound vision: to bridge the gap between traditional craftsmanship and contemporary style. Our journey started in the heart of the artisan community, where we discovered the timeless beauty of hand-stitched Panjabis and the mystical allure of organic Attars.',
  'We believe that clothing and fragrance are more than just products; they are reflections of identity and culture. That''s why we source only the finest materials—from premium Egyptian cotton to the rarest essential oils—ensuring that every piece carries the legacy of quality.',
  'To preserve and promote traditional artistry by crafting premium attire and fragrances that inspire confidence and celebrate authenticity in a modern world.',
  'To become a global symbol of refined traditionalism, where every thread and scent tells a story of heritage, quality, and timeless grace.',
  'concierge@alhurumah.com', 
  '+880 1234 567890', 
  'Gulshan-2, Dhaka', 
  '10:00 AM - 09:00 PM',
  'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000'
)
ON CONFLICT (id) DO NOTHING;


-- 6. User Carts Table (For persisting cart items of logged-in users)
CREATE TABLE IF NOT EXISTS user_carts (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on user_carts
ALTER TABLE user_carts ENABLE ROW LEVEL SECURITY;

-- User Carts Policies
CREATE POLICY "Users can manage their own cart." ON user_carts FOR ALL USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);
