## TABLES

┌─────────────────────────────┐
│ USERS │
├─────────────────────────────┤
│ id (PK) UUID │
│ email VARCHAR │
│ username VARCHAR │
│ password_hash VARCHAR │
│ currency_balance INTEGER │
│ created_at TIMESTAMP │
│ updated_at TIMESTAMP │
│ is_active BOOLEAN │
│ last_login TIMESTAMP │
└─────────────────────────────┘
│
│ 1:N
▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│ CURRENCY_TRANSACTIONS │ │ CURRENCY_PACKAGES │
├─────────────────────────────┤ ├─────────────────────────────┤
│ id (PK) UUID │ │ id (PK) UUID │
│ user_id (FK) UUID │ │ name VARCHAR │
│ type ENUM │ │ currency_amount INTEGER │
│ amount INTEGER │ │ price_cents INTEGER │
│ balance_after INTEGER │ │ bonus_amount INTEGER │
│ reference_type VARCHAR │ │ is_active BOOLEAN │
│ reference_id UUID │ │ created_at TIMESTAMP │
│ description TEXT │ └─────────────────────────────┘
│ created_at TIMESTAMP │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ICON_PACKS │
├─────────────────────────────┤
│ id (PK) UUID │
│ name VARCHAR │
│ description TEXT │
│ price INTEGER │
│ preview_icon_url VARCHAR │
│ total_icons INTEGER │
│ is_active BOOLEAN │
│ created_at TIMESTAMP │
│ updated_at TIMESTAMP │
└─────────────────────────────┘
│
│ 1:N
▼
┌─────────────────────────────┐
│ ICONS │
├─────────────────────────────┤
│ id (PK) UUID │
│ pack_id (FK) UUID │
│ name VARCHAR │
│ file_url VARCHAR │
│ rarity INTEGER │
│ is_unlocked BOOLEAN │
│ created_at TIMESTAMP │
└─────────────────────────────┘

┌─────────────────────────────┐ ┌──────────────────────────────┐
│ PURCHASES │ │ USER_OWNED_ICONS │
├─────────────────────────────┤ ├──────────────────────────────┤
│ id (PK) UUID │ │ user_id (FK) UUID │
│ user_id (FK) UUID │ │ icon_id (FK) UUID │
│ pack_id (FK) UUID │ │ unlocked_at TIMESTAMP │
│ icon_id (FK) UUID │ │ PRIMARY KEY (user_id,icon_id)│
│ price_paid INTEGER │ └──────────────────────────────┘
│ transaction_id UUID │ ▲
│ purchased_at TIMESTAMP │ │
└─────────────────────────────┘ │
│ │
└─────────────────────────────────┘
Creates entry in

## ENUM TYPES

- transaction_type: 'purchase', 'refund', 'bonus', 'admin_adjustment', 'currency_buy'

## INDEXES

- users.email (UNIQUE)
- users.username (UNIQUE)
- currency_transactions.user_id
- currency_transactions.created_at
- icon_packs.price
- icon_packs.is_active
- icons.pack_id
- icons.is_unlocked
- purchases.user_id
- purchases.purchased_at
- user_owned_icons.user_id
