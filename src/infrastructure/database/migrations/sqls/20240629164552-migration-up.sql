/* Replace with your SQL commands */
CREATE TABLE transfers (
    id SERIAL PRIMARY KEY,
    status VARCHAR(255) NOT NULL,
    value NUMERIC NOT NULL,
    from_wallet VARCHAR(255) NOT NULL,
    to_wallet VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
