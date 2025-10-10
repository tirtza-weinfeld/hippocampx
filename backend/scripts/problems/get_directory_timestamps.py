#!/usr/bin/env python3

"""
Get creation and modification timestamps for problem directories.

This module provides functionality to extract filesystem timestamps from
problem directories, tracking when folders were created and last modified.
"""

from datetime import datetime
from pathlib import Path


def get_directory_timestamps(problem_dir: Path) -> dict[str, str]:
    """
    Get creation and modification timestamps for a problem directory.

    Args:
        problem_dir: Path to the problem directory

    Returns:
        Dictionary with 'created_at' and 'updated_at' in ISO 8601 format
        - created_at: When the directory was created
        - updated_at: Latest modification time of any file in the directory
    """
    if not problem_dir.exists() or not problem_dir.is_dir():
        return {
            'created_at': '',
            'updated_at': ''
        }

    # Get directory creation time
    dir_stat = problem_dir.stat()
    created_at = datetime.fromtimestamp(dir_stat.st_birthtime)

    # Find the latest modification time among all files in the directory
    latest_mtime = dir_stat.st_mtime

    for file_path in problem_dir.iterdir():
        # Skip hidden files and directories
        if file_path.name.startswith('.'):
            continue

        try:
            file_stat = file_path.stat()
            latest_mtime = max(latest_mtime, file_stat.st_mtime)
        except (OSError, PermissionError):
            # Skip files we can't access
            continue

    updated_at = datetime.fromtimestamp(latest_mtime)

    return {
        'created_at': created_at.isoformat(),
        'updated_at': updated_at.isoformat()
    }
