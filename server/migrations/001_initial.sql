-- Initial database schema for IconStore
-- Based on schema.md specification

-- Create custom ENUM types
CREATE TYPE transaction_type AS ENUM ('purchase', 'refund', 'bonus', 'admin_adjustment', 'currency_buy');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    currency_balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Currency packages table
CREATE TABLE currency_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    currency_amount INTEGER NOT NULL,
    price_cents INTEGER NOT NULL,
    bonus_amount INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Currency transactions table
CREATE TABLE currency_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reference_type VARCHAR(255),
    reference_id UUID,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Icon packs table
CREATE TABLE icon_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    preview_icon_url VARCHAR(500),
    total_icons INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Icons table
CREATE TABLE icons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pack_id UUID NOT NULL REFERENCES icon_packs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    rarity INTEGER NOT NULL DEFAULT 1,
    is_unlocked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table
CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pack_id UUID REFERENCES icon_packs(id) ON DELETE SET NULL,
    icon_id UUID REFERENCES icons(id) ON DELETE SET NULL,
    price_paid INTEGER NOT NULL,
    transaction_id UUID NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User owned icons junction table
CREATE TABLE user_owned_icons (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    icon_id UUID NOT NULL REFERENCES icons(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, icon_id)
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_currency_transactions_user_id ON currency_transactions(user_id);
CREATE INDEX idx_currency_transactions_created_at ON currency_transactions(created_at);
CREATE INDEX idx_icon_packs_price ON icon_packs(price);
CREATE INDEX idx_icon_packs_is_active ON icon_packs(is_active);
CREATE INDEX idx_icons_pack_id ON icons(pack_id);
CREATE INDEX idx_icons_is_unlocked ON icons(is_unlocked);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_purchased_at ON purchases(purchased_at);
CREATE INDEX idx_user_owned_icons_user_id ON user_owned_icons(user_id);