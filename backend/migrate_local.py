import sqlite3

def add_column(conn, table, column, definition):
    try:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
        print(f"Added {column} to {table}")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print(f"Column {column} already exists in {table}")
        else:
            raise e

conn = sqlite3.connect('anytimellm.db')
add_column(conn, 'businesses', 'business_type', 'VARCHAR(50)')
add_column(conn, 'businesses', 'onboarding_status', "VARCHAR(50) DEFAULT 'pending'")
add_column(conn, 'conversations', 'is_ai_paused', 'BOOLEAN DEFAULT FALSE')
add_column(conn, 'messages', 'meta_message_id', 'VARCHAR(255)')

# Also apply indexes
conn.execute("CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);")
conn.execute("CREATE INDEX IF NOT EXISTS ix_users_business_id ON users (business_id);")

conn.commit()
conn.close()
print("Migration complete!")
