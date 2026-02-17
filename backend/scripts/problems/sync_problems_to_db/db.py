"""Database connection for sync script."""

import os
import re
from pathlib import Path

import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env.local in project root
env_path = Path(__file__).parent.parent.parent.parent.parent / '.env.local'
load_dotenv(env_path)


def get_db_connection():
    """Get PostgreSQL connection from environment variables."""
    database_url = os.getenv('NEON_DATABASE_URL')

    if not database_url:
        raise ValueError("NEON_DATABASE_URL environment variable not set in .env.local")

    # Override sslmode to require for encrypted connection without certificate verification
    # (macOS system trust store doesn't work reliably with libpq)
    database_url = re.sub(r'sslmode=[^&]*', 'sslmode=require', database_url)
    if 'sslmode' not in database_url:
        separator = '&' if '?' in database_url else '?'
        database_url = f"{database_url}{separator}sslmode=require"

    return psycopg2.connect(database_url)
