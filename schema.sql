
CREATE DATABASE TudoOrganico;
GO
USE TudoOrganico;

CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY,
  firstName NVARCHAR(100),
  lastName NVARCHAR(100),
  email NVARCHAR(255) UNIQUE,
  password NVARCHAR(255),
  phone NVARCHAR(20),
  address NVARCHAR(255),
  accountType NVARCHAR(20),
  freeDelivery BIT DEFAULT 0
);

CREATE TABLE Products (
  id INT PRIMARY KEY IDENTITY,
  name NVARCHAR(100),
  price DECIMAL(10,2),
  image NVARCHAR(500),
  state NVARCHAR(2),
  city NVARCHAR(100),
  vendedorId INT,
  FOREIGN KEY (vendedorId) REFERENCES Users(id)
);

CREATE TABLE Orders (
  id INT PRIMARY KEY IDENTITY,
  userId INT,
  total DECIMAL(10,2),
  dataCompra DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE OrderItems (
  id INT PRIMARY KEY IDENTITY,
  orderId INT,
  productId INT,
  quantity INT,
  precoUnitario DECIMAL(10,2),
  FOREIGN KEY (orderId) REFERENCES Orders(id),
  FOREIGN KEY (productId) REFERENCES Products(id)
);

CREATE TABLE Ratings (
  id INT PRIMARY KEY IDENTITY,
  userId INT,
  productId INT,
  estrelas INT,
  dataAvaliacao DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (productId) REFERENCES Products(id)
);
