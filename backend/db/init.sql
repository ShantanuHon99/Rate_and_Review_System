-- Create and use the database
CREATE DATABASE IF NOT EXISTS rate_review_db;
USE rate_review_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    price DECIMAL(10, 2)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    rating DECIMAL(2,1),
    review_text TEXT,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

-- Dummy Products
INSERT INTO products (name, description, image_url, price) VALUES
('Samsung Galaxy M14', 'A powerful budget phone.', 'https://m.media-amazon.com/images/I/81ZSn2rk9WL._SX679_.jpg', 12999.00),
('Sony Headphones', 'Noise cancelling over-ear headphones.', 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._SX679_.jpg', 4999.00),
('boAt Stone 650', 'Bluetooth speaker with 10W RMS stereo output.', 'https://www.boat-lifestyle.com/cdn/shop/products/0efd1f68-8988-4e8a-98bc-6690ccb6a828_600x.png?v=1625045298', 1999.00);
