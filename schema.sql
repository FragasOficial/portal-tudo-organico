
CREATE DATABASE TudoOrganico;
GO
USE TudoOrganico;

CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY,
  firstName NVARCHAR(100),
  lastName NVARCHAR(100),
  email NVARCHAR(255) UNIQUE,
  passwordHash NVARCHAR(255), -- Renomeado para consistência
  phone NVARCHAR(20),
  address NVARCHAR(255),
  accountType NVARCHAR(20),
  freeDelivery BIT DEFAULT 0
);

CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image NVARCHAR(255) NOT NULL, -- URL da imagem
    city NVARCHAR(100) NOT NULL,
    state NVARCHAR(2) NOT NULL,
    vendedorId INT NOT NULL, -- Chave estrangeira para a tabela Users (vendedor)
    createdAt DATETIME DEFAULT GETDATE(),
    updatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (vendedorId) REFERENCES Users(id) -- Garante que vendedorId existe na tabela Users
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
