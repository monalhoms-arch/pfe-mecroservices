-- ═══════════════════════════════════════
--  قاعدة بيانات منصة خدمتي
-- ═══════════════════════════════════════

CREATE DATABASE IF NOT EXISTS abc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE abc;

-- ── جدول الحسابات الخاص بخدمة الواتساب (Security & Notifications) ──
CREATE TABLE IF NOT EXISTS accounts (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    phone_number         VARCHAR(20)  NOT NULL UNIQUE,
    account_type         VARCHAR(50)  NOT NULL, -- 'customer', 'provider', 'admin'
    is_business_whatsapp BOOLEAN      DEFAULT FALSE,
    name                 VARCHAR(100),
    INDEX (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── جدول مزودي الخدمة ──
CREATE TABLE IF NOT EXISTS provider (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone     VARCHAR(20)  NOT NULL,
    job       VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── جدول المواعيد (ميزة حجز الموعد) ──
CREATE TABLE IF NOT EXISTS appointments (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    provider_id          INT          NOT NULL,
    customer_name        VARCHAR(100) NOT NULL,
    appointment_datetime DATETIME     NOT NULL,
    status               ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES provider(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── جدول الفواتير (ميزة PDF) ──
CREATE TABLE IF NOT EXISTS invoices (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    invoice_code VARCHAR(20)    NOT NULL UNIQUE,
    provider_id  INT            NOT NULL,
    customer_name VARCHAR(100)  NOT NULL,
    service_price DECIMAL(10,2) NOT NULL,
    pdf_path     VARCHAR(255),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES provider(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── بيانات تجريبية ──
INSERT INTO provider (full_name, phone, job) VALUES
('أحمد محمد',   '213550747243', 'كهربائي منازل'),
('سليم بن عيسى','213676256392', 'سباك صحي'),
('ياسين حامد',  '213770123456', 'مصلح أجهزة')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);
