"""Shared test fixtures and configuration."""

import asyncio
import sys
from pathlib import Path
from typing import AsyncGenerator, Generator

import pytest
from httpx import ASGITransport, AsyncClient


# Add backend to Python path
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def project_root() -> Path:
    """Get the project root directory."""
    return Path(__file__).parent.parent.parent


@pytest.fixture
def backend_root() -> Path:
    """Get the backend root directory."""
    return Path(__file__).parent.parent


@pytest.fixture
def examples_code_path(project_root: Path) -> Path:
    """Get the examples/code directory path."""
    return project_root / "examples" / "code"


@pytest.fixture
def test_data_path() -> Path:
    """Get the test data directory path."""
    return Path(__file__).parent / "data"


@pytest.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    """Create an async HTTP client for API testing."""
    async with AsyncClient(
        transport=ASGITransport(),
        base_url="http://test",
        follow_redirects=True,
    ) as client:
        yield client


class TestDataBuilder:
    """Helper class for building test data."""

    @staticmethod
    def create_algorithm_metadata(name: str, **kwargs) -> dict:
        """Create test algorithm metadata."""
        return {
            "name": name,
            "description": kwargs.get("description", f"Test algorithm {name}"),
            "parameters": kwargs.get("parameters", []),
            "returns": kwargs.get("returns", {"type": "Any", "description": "Result"}),
            "code": kwargs.get("code", f"def {name}():\n    pass"),
            "links": kwargs.get("links", []),
            **kwargs,
        }

    @staticmethod
    def create_test_file_content(functions: list[str]) -> str:
        """Create test Python file content with given functions."""
        content = '"""Test module."""\n\n'
        for func in functions:
            content += f"def {func}():\n    pass\n\n"
        return content


@pytest.fixture
def test_data_builder() -> TestDataBuilder:
    """Get the test data builder."""
    return TestDataBuilder()


@pytest.fixture(autouse=True)
def clean_sys_modules():
    """Clean up sys.modules after each test to prevent import pollution."""
    original_modules = set(sys.modules.keys())
    yield
    # Remove any modules that were imported during the test
    current_modules = set(sys.modules.keys())
    new_modules = current_modules - original_modules
    for module_name in new_modules:
        if module_name.startswith("test_") or "test" in module_name:
            sys.modules.pop(module_name, None)