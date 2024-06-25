-- Create the ICustomer table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    document VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Create the IWallet table
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL UNIQUE,
    wallet_type VARCHAR(16) NOT NULL CHECK (wallet_type IN ('CUSTOMER', 'COMPANY')),
    balance NUMERIC DEFAULT 0 NOT NULL
);