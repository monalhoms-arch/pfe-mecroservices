-- ═══════════════════════════════════════
--  Khidmati Platform Database (PostgreSQL)
-- ═══════════════════════════════════════

-- Accounts table for WhatsApp service (Security & Notifications)
CREATE TABLE IF NOT EXISTS accounts (
    id                   SERIAL PRIMARY KEY,
    phone_number         VARCHAR(20)  NOT NULL UNIQUE,
    account_type         VARCHAR(50)  NOT NULL, -- 'customer', 'provider', 'admin'
    is_business_whatsapp BOOLEAN      DEFAULT FALSE,
    name                 VARCHAR(100)
);
CREATE INDEX IF NOT EXISTS idx_accounts_phone ON accounts(phone_number);

-- Service Providers table
CREATE TABLE IF NOT EXISTS provider (
    id        SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone     VARCHAR(20)  NOT NULL,
    job       VARCHAR(100)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id                   SERIAL PRIMARY KEY,
    provider_id          INT          NOT NULL REFERENCES provider(id),
    customer_name        VARCHAR(100) NOT NULL,
    appointment_datetime TIMESTAMP    NOT NULL,
    status               VARCHAR(20)  DEFAULT 'pending', -- 'pending','confirmed','cancelled'
    created_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table (PDF Service)
CREATE TABLE IF NOT EXISTS invoices (
    id            SERIAL PRIMARY KEY,
    invoice_code  VARCHAR(20)    NOT NULL UNIQUE,
    provider_id   INT            NOT NULL REFERENCES provider(id),
    customer_name VARCHAR(100)   NOT NULL,
    service_price DECIMAL(10,2)  NOT NULL,
    pdf_path      VARCHAR(255),
    created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (Optional)
INSERT INTO provider (full_name, phone, job) VALUES
('أحمد محمد',   '213550747243', 'كهربائي منازل'),
('سليم بن عيسى','213676256392', 'سباك صحي'),
('ياسين حامد',  '213770123456', 'مصلح أجهزة')
ON CONFLICT (id) DO NOTHING;
