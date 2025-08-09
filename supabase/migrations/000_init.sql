-- Create messages table
CREATE TABLE messages (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    content text NOT NULL CHECK (char_length(trim(content)) BETWEEN 1 AND 300),
    nickname text NOT NULL DEFAULT 'Anonyme',
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for efficient ordering
CREATE INDEX idx_messages_created_at_desc ON messages (created_at DESC);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy for reading messages (everyone can read)
CREATE POLICY "Allow public read access" ON messages
    FOR SELECT USING (true);

-- Policy for inserting messages (everyone can insert with validation)
CREATE POLICY "Allow public insert access" ON messages
    FOR INSERT WITH CHECK (char_length(trim(content)) BETWEEN 1 AND 300);
