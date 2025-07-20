CREATE DATABASE TudoOrganico;
GO
USE TudoOrganico;

CREATE TABLE dbo.Users (
  id INT PRIMARY KEY IDENTITY,
  firstName NVARCHAR(100),
  lastName NVARCHAR(100),
  email NVARCHAR(255) UNIQUE,
  passwordHash NVARCHAR(255),
  phone NVARCHAR(20),
  address NVARCHAR(255),
  city NVARCHAR(100), -- Adicionado campo city
  state NVARCHAR(2),    -- Adicionado campo state
  accountType NVARCHAR(20),
  freeDelivery BIT DEFAULT 0
);

CREATE TABLE dbo.Produtos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image NVARCHAR(255) NOT NULL, -- URL da imagem
    city NVARCHAR(100) NOT NULL,
    state NVARCHAR(2) NOT NULL,
    vendedorId INT NOT NULL, -- Chave estrangeira para a tabela dbo.Users (vendedor)
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (vendedorId) REFERENCES dbo.Users(id) -- Garante que vendedorId existe na tabela dbo.Users
);

CREATE TABLE dbo.Orders (
  id INT PRIMARY KEY IDENTITY,
  userId INT,
  total DECIMAL(10,2),
  dataCompra DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (userId) REFERENCES dbo.Users(id)
);

CREATE TABLE dbo.OrderItems (
  id INT PRIMARY KEY IDENTITY,
  orderId INT,
  productId INT,
  quantity INT,
  precoUnitario DECIMAL(10,2),
  FOREIGN KEY (orderId) REFERENCES dbo.Orders(id),
  FOREIGN KEY (productId) REFERENCES dbo.Produtos(id)
);

CREATE TABLE dbo.Ratings (
  id INT PRIMARY KEY IDENTITY,
  userId INT,
  productId INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  dataAvaliacao DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (userId) REFERENCES dbo.Users(id),
  FOREIGN KEY (productId) REFERENCES dbo.Produtos(id)
);