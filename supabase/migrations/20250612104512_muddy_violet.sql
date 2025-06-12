/*
  # Complete Database Schema and Sample Data

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `parent_id` (uuid, foreign key to categories)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `specifications` (jsonb)
      - `price` (decimal)
      - `images` (text array)
      - `video_url` (text, optional)
      - `category` (text)
      - `subcategory` (text, optional)
      - `tags` (text array)
      - `features` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated user write access

  3. Performance
    - Add indexes for common queries
    - Add GIN indexes for array fields
    - Add trigger for automatic timestamp updates

  4. Sample Data
    - Insert main categories (drones, robots)
    - Insert drone subcategories (agricultural, industrial, other)
    - Insert 6 sample products with complete specifications
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  parent_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  description text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  specifications jsonb DEFAULT '{}',
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  images text[] DEFAULT '{}',
  video_url text,
  category text NOT NULL,
  subcategory text,
  tags text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories are insertable by authenticated users"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Categories are updatable by authenticated users"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for products
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Products are insertable by authenticated users"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Products are updatable by authenticated users"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_description ON products(description);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert main categories
INSERT INTO categories (name, description, image_url) VALUES
  ('drones', 'Professional drones for various applications', 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg'),
  ('robots', 'Advanced robotics solutions for automation', 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg')
ON CONFLICT (name) DO NOTHING;

-- Get category IDs for subcategories
DO $$
DECLARE
  drone_category_id uuid;
BEGIN
  SELECT id INTO drone_category_id FROM categories WHERE name = 'drones';
  
  -- Insert drone subcategories
  INSERT INTO categories (name, parent_id, description, image_url) VALUES
    ('agricultural', drone_category_id, 'Drones for farming and agriculture', 'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg'),
    ('industrial', drone_category_id, 'Industrial and commercial drones', 'https://images.pexels.com/photos/1472515/pexels-photo-1472515.jpeg'),
    ('other', drone_category_id, 'Specialized and other drone applications', 'https://images.pexels.com/photos/2050718/pexels-photo-2050718.jpeg')
  ON CONFLICT (name) DO NOTHING;
END $$;

-- Insert sample products
INSERT INTO products (
  name, 
  description, 
  specifications, 
  price, 
  images, 
  video_url,
  category, 
  subcategory, 
  tags, 
  features
) VALUES
-- Agricultural Drones
(
  'AgriDrone Pro X1',
  'The AgriDrone Pro X1 represents the pinnacle of agricultural drone technology, combining advanced imaging capabilities with precision application systems. Designed for modern farming operations, this drone delivers exceptional performance in crop monitoring, health assessment, and targeted treatments.',
  '{
    "flight_time": "45 minutes",
    "max_payload": "10 kg",
    "operating_range": "15 km",
    "camera_resolution": "4K HDR",
    "gps_accuracy": "RTK ±2cm",
    "weather_rating": "IP54",
    "operating_temperature": "-10°C to 45°C",
    "max_wind_speed": "12 m/s",
    "charging_time": "90 minutes",
    "weight": "8.5 kg",
    "sensors": ["Multispectral", "Thermal", "RGB", "NDVI"],
    "spray_system": "Precision nozzle array",
    "tank_capacity": "10 liters"
  }',
  15999.00,
  ARRAY[
    'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg',
    'https://images.pexels.com/photos/1472515/pexels-photo-1472515.jpeg',
    'https://images.pexels.com/photos/2050718/pexels-photo-2050718.jpeg'
  ],
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'drones',
  'agricultural',
  ARRAY['Agriculture', 'Precision Farming', 'Crop Monitoring', 'GPS', 'Professional', 'Multispectral'],
  ARRAY[
    'Autonomous flight planning and execution',
    'Weather-resistant design for all-season operation',
    'Real-time data transmission and analysis',
    'Mobile app control with intuitive interface',
    'Advanced obstacle avoidance system',
    'Multi-spectral imaging capabilities',
    'Precision spraying system',
    'Long-range communication system'
  ]
),

-- Industrial Drones
(
  'SurveyDrone Mapper Pro',
  'High-precision surveying drone with LiDAR technology for accurate topographical mapping and construction site monitoring. Built for professional surveyors and construction companies.',
  '{
    "flight_time": "55 minutes",
    "accuracy": "RTK ±2cm",
    "camera": "Survey-grade RGB 42MP",
    "lidar": "High-density point cloud 300,000 pts/sec",
    "range": "20 km",
    "weather_rating": "IP65",
    "operating_altitude": "Up to 4000m",
    "data_storage": "1TB SSD",
    "processing_unit": "NVIDIA Jetson Xavier",
    "weight": "12.3 kg"
  }',
  28999.00,
  ARRAY[
    'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg',
    'https://images.pexels.com/photos/1472515/pexels-photo-1472515.jpeg'
  ],
  null,
  'drones',
  'industrial',
  ARRAY['Surveying', 'Mapping', 'LiDAR', 'Construction', 'RTK', 'Professional'],
  ARRAY[
    'RTK GPS for centimeter accuracy',
    'Point cloud generation and processing',
    'Automated flight planning software',
    'Real-time data processing',
    'Weather-resistant construction',
    'Long-range communication',
    'Professional mapping software included',
    'Cloud data synchronization'
  ]
),

-- Emergency/Rescue Drones
(
  'RescueDrone Emergency Response',
  'Search and rescue drone with thermal imaging and emergency response capabilities. Designed for first responders and emergency services.',
  '{
    "flight_time": "40 minutes",
    "thermal_camera": "FLIR 640x512",
    "optical_zoom": "30x",
    "weather_rating": "IP67",
    "operating_temp": "-20°C to 50°C",
    "night_vision": "Full spectrum",
    "communication": "Encrypted radio",
    "emergency_beacon": "GPS distress signal",
    "weight": "6.8 kg",
    "max_altitude": "6000m"
  }',
  22999.00,
  ARRAY[
    'https://images.pexels.com/photos/442587/pexels-photo-442587.jpeg',
    'https://images.pexels.com/photos/2050718/pexels-photo-2050718.jpeg'
  ],
  null,
  'drones',
  'other',
  ARRAY['Emergency', 'Search & Rescue', 'Thermal Imaging', 'Weather Resistant', 'First Responders'],
  ARRAY[
    'Thermal imaging for night operations',
    'Emergency beacon and GPS tracking',
    'Live video streaming to command center',
    'Quick deployment system',
    'Encrypted communication channels',
    'All-weather operation capability',
    'Extended battery life',
    'Rugged construction'
  ]
),

-- Industrial Robots
(
  'IndustrialBot Alpha Manufacturing',
  'Heavy-duty industrial robot for manufacturing automation with precision control and advanced safety features. Perfect for assembly lines and production facilities.',
  '{
    "payload": "50 kg",
    "reach": "2.5 meters",
    "accuracy": "±0.1 mm",
    "power": "3.2 kW",
    "controller": "Advanced PLC with AI",
    "axes": "6-axis articulated",
    "cycle_time": "3.2 seconds",
    "operating_temp": "0°C to 45°C",
    "safety_rating": "Category 3 PLd",
    "weight": "180 kg"
  }',
  45999.00,
  ARRAY[
    'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg',
    'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg'
  ],
  null,
  'robots',
  null,
  ARRAY['Manufacturing', 'Automation', 'Precision', 'Industrial', 'Assembly', 'AI'],
  ARRAY[
    'Advanced safety sensors and systems',
    'Programmable logic controller',
    'Remote monitoring and diagnostics',
    '24/7 continuous operation capability',
    'AI-powered optimization',
    'Easy programming interface',
    'Predictive maintenance alerts',
    'Industry 4.0 connectivity'
  ]
),

-- Cleaning Robot
(
  'CleanBot Pro Commercial',
  'Autonomous cleaning robot with advanced navigation and multi-surface cleaning capabilities. Designed for commercial spaces and large facilities.',
  '{
    "battery_life": "4 hours continuous",
    "coverage": "500 sqm/hour",
    "navigation": "SLAM + Computer Vision",
    "cleaning_modes": ["Vacuum", "Mop", "Scrub", "Polish"],
    "water_tank": "2 liters",
    "dust_capacity": "1.5 liters",
    "sensors": "360° LiDAR + cameras",
    "connectivity": "WiFi + 4G",
    "weight": "25 kg",
    "dimensions": "60x40x30 cm"
  }',
  8999.00,
  ARRAY[
    'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg'
  ],
  null,
  'robots',
  null,
  ARRAY['Cleaning', 'Autonomous', 'Commercial', 'Navigation', 'SLAM'],
  ARRAY[
    'Automatic charging and resumption',
    'Mobile app control and monitoring',
    'Advanced obstacle avoidance',
    'Scheduled cleaning programs',
    'Multi-floor mapping capability',
    'Remote diagnostics and updates',
    'HEPA filtration system',
    'Commercial-grade durability'
  ]
),

-- Precision Assembly Robot
(
  'AssemblyBot Precision Micro',
  'Ultra-precision assembly robot for electronics manufacturing with micro-manipulation capabilities and vision-guided assembly.',
  '{
    "payload": "5 kg",
    "accuracy": "±0.05 mm",
    "cycle_time": "2.5 seconds",
    "axes": "6-axis articulated",
    "vision_system": "High-resolution stereo cameras",
    "force_control": "6-axis force/torque sensor",
    "working_envelope": "800mm radius",
    "controller": "Real-time motion control",
    "programming": "Drag-and-drop interface",
    "weight": "45 kg"
  }',
  67999.00,
  ARRAY[
    'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg',
    'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg'
  ],
  null,
  'robots',
  null,
  ARRAY['Assembly', 'Electronics', 'Precision', 'Manufacturing', 'Vision', 'Micro-manipulation'],
  ARRAY[
    'Vision-guided precision assembly',
    'Force-controlled insertion operations',
    'Quality inspection and verification',
    'Flexible programming environment',
    'Component recognition and sorting',
    'Statistical process control',
    'Integration with MES systems',
    'Cleanroom compatible design'
  ]
)
ON CONFLICT (name) DO NOTHING;