"""Supabase admin client (service role, server-only). Tables are RLS-on, read/written here."""
from __future__ import annotations

import os

from supabase import Client, create_client

_admin: Client | None = None


def admin() -> Client:
    global _admin
    if _admin is None:
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        _admin = create_client(url, key)
    return _admin
