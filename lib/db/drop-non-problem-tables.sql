-- Drop all non-problem related tables

-- Quiz/learning tables (must drop first due to foreign keys)
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS terms CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Dictionary tables
DROP TABLE IF EXISTS antonyms CASCADE;
DROP TABLE IF EXISTS related_words CASCADE;
DROP TABLE IF EXISTS synonyms CASCADE;
DROP TABLE IF EXISTS word_forms CASCADE;
DROP TABLE IF EXISTS phrases CASCADE;
DROP TABLE IF EXISTS definitions CASCADE;
DROP TABLE IF EXISTS words CASCADE;

-- Algorithm complexity table
DROP TABLE IF EXISTS algorithms CASCADE;

-- Drop enums
DROP TYPE IF EXISTS part_of_speech CASCADE;
