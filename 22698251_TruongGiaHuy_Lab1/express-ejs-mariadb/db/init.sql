CREATE DATABASE IF NOT EXISTS shopdb;
USE shopdb;

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0
);

INSERT INTO products (name, price, quantity) VALUES
    ('iPhone 15 Pro Max', 1199.99, 50),
    ('Samsung Galaxy S24 Ultra', 1099.99, 45),
    ('MacBook Pro 14"', 1999.00, 30),
    ('Dell XPS 15', 1599.00, 25),
    ('iPad Pro 12.9"', 1099.00, 40),
    ('Sony WH-1000XM5', 349.99, 100),
    ('Apple Watch Series 9', 399.00, 75),
    ('AirPods Pro 2', 249.00, 150),
    ('Nintendo Switch OLED', 349.99, 60),
    ('PlayStation 5', 499.99, 35);

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
