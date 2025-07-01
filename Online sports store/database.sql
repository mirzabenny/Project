-- Create database
CREATE DATABASE IF NOT EXISTS sportivo_db;
USE sportivo_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table (for future use)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    link VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table (for future use)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create order_items table (for future use)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create wishlist table (for future use)
CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Insert sample products
INSERT INTO products (name, brand, price, image, category, link) VALUES
('Inflatable Pool Ring 51 cm', 'NABAIJI', 499.00, 'fproduct1.avif', 'Swimming', 'sproduct1.html'),
('Boys suit - short sleeve shorty', 'NABAIJI', 1299.00, 'fproduct2.avif', 'Swimming', 'sproduct2.html'),
('Girls Swimming Shorty swimsuit', 'NABAIJI', 1299.00, 'fproduct3.avif', 'Swimming', 'sproduct3.html'),
('Kids Swimming Goggles UV Protection Anti Fogging Clear Lenses Xbase', 'NABAIJI', 399.00, 'fproduct4.avif', 'Swimming', 'sproduct4.html'),
('Compact Microfibre Swimming Towel', 'NABAIJI', 699.00, 'fproduct5.avif', 'Swimming', 'sproduct5.html'),
('Waterproof Bag Ipx6 30 L Orange', 'ITIWIT', 1699.00, 'fproduct6.avif', 'Bags', 'sproduct6.html'),
('Cotton Mens Fitness T-Shirt 100 Sport tee', 'DOMYOS', 299.00, 'newarrivals1.avif', 'T-shirts', 'sproduct7.html'),
('Hiking Backpack 10L, NH100 Arpenaz blue', 'QUECHUA', 499.00, 'newarrivals2.avif', 'Bags', 'sproduct8.html'),
('Womens waterproof hiking jacket -10°C, NH500 - Blue', 'QUECHUA', 3999.00, 'newarrivals3.avif', 'Jacket', 'sproduct9.html'),
('RUN ACTIVE Lightweight Cushioned Men Running Shoes UPTO 10 km/wk - Carmine Red', 'KALENJI', 2299.00, 'newarrivals4.avif', 'Shoes', 'sproduct10.html'),
('Aluminium Water Bottle with Easy Locking Cap - 1 Litre Sage Green', 'QUECHUA', 2299.00, 'newarrivals5.avif', 'Accessories', 'sproduct11.html'),
('RUN CUSHION Comfortale Lite Antislip Women Running Shoes Turquoise Green', 'KALENJI', 1699.00, 'newarrivals6.avif', 'Shoes', 'sproduct12.html'); 