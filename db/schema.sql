CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ROLES
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PERMISSIONS
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- ROLE PERMISSIONS
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active','inactive')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- FINANCIAL RECORDS
CREATE TABLE financial_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
    type VARCHAR(20) CHECK (type IN ('income','expense')),
    category VARCHAR(100) NOT NULL,
    notes TEXT,
    record_date DATE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_records_date ON financial_records(record_date) WHERE is_deleted = FALSE;
CREATE INDEX idx_records_user ON financial_records(user_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_records_type_category ON financial_records(type, category) WHERE is_deleted = FALSE;

-- Default Roles
INSERT INTO roles (name) VALUES ('admin'), ('analyst'), ('viewer');

-- Default Permissions
INSERT INTO permissions (name) VALUES
('CREATE_RECORD'),
('VIEW_RECORD'),
('UPDATE_RECORD'),
('DELETE_RECORD'),
('VIEW_DASHBOARD'),
('MANAGE_USERS'),
('ASSIGN_ROLES');

-- ADMIN GETS ALL
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name='admin';