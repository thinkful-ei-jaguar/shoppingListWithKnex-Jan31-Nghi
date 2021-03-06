-- Check if table exist, if not then create
CREATE TABLE IF NOT EXISTS whopipe_video_views (
	view_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	video_name TEXT NOT NULL,
	region TEXT NOT NULL,
	date_viewed TIMESTAMP DEFAULT now() NOT NULL
);

-- Delete type if any
-- Type does not supper "IF NOT EXISTS"
DROP TYPE IF EXISTS department;

-- Create type
CREATE TYPE department AS ENUM (
    'Electronics',
    'Cleaning',
    'Grocery',
    'Furniture',
    'Stationery',
    'Clothing',
    'DIY',
    'Sports',
    'Homeware',
    'Games',
    'Transport'
);

-- Create table if not already exist
CREATE TABLE IF NOT EXISTS amazong_products(
	product_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	name TEXT NOT NULL,
    price decimal(12,2) NOT NULL,
    image TEXT,
    category department NOT NULL
);








