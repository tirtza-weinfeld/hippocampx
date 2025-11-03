.PHONY: test test-unit test-integration test-api test-algorithms test-metadata test-e2e
.PHONY: test-cov test-watch lint format type-check check install dev-install clean
.PHONY: play-tictactoe

# Python and virtual environment
PYTHON := python3.13
VENV := venv
VENV_BIN := $(VENV)/bin
PIP := $(VENV_BIN)/pip
PYTEST := $(VENV_BIN)/pytest
RUFF := $(VENV_BIN)/ruff
MYPY := $(VENV_BIN)/mypy

# Testing commands
test: ## Run all tests
	$(PYTEST)

test-unit: ## Run unit tests only
	$(PYTEST) tests/unit -m "unit"

test-integration: ## Run integration tests only
	$(PYTEST) tests/integration -m "integration"

test-api: ## Run API tests only
	$(PYTEST) tests/api -m "api"

test-algorithms: ## Run algorithm tests only
	$(PYTEST) tests/algorithms -m "algorithms"

test-metadata: ## Run metadata extraction tests only
	$(PYTEST) tests/metadata -m "metadata"

test-e2e: ## Run end-to-end tests only
	$(PYTEST) tests/e2e -m "e2e"

test-cov: ## Run tests with coverage
	$(PYTEST) --cov=backend --cov-report=html --cov-report=term-missing

test-watch: ## Run tests in watch mode
	$(PYTEST) --watch

# Code quality commands
lint: ## Run linting
	$(RUFF) check backend tests

lint-fix: ## Fix linting issues
	$(RUFF) check --fix backend tests

format: ## Format code
	$(RUFF) format backend tests

type-check: ## Run type checking
	$(MYPY) backend

check: lint type-check ## Run all checks

# Development setup
install: ## Install production dependencies
	$(PIP) install -r requirements.txt

dev-install: ## Install development dependencies
	$(PIP) install -r requirements.txt
	$(PIP) install -e ".[test,dev]"

venv: ## Create virtual environment
	$(PYTHON) -m venv $(VENV)
	$(PIP) install --upgrade pip

clean: ## Clean up temporary files
	rm -rf htmlcov/
	rm -rf .coverage
	rm -rf .pytest_cache/
	rm -rf __pycache__/
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -name "*.pyc" -delete

# Interactive demos
play-tictactoe: ## Play Tic-Tac-Toe with AI (requires pygame)
	@cd "algorithms/more/tictactoe" && ../../../$(VENV_BIN)/python runner.py

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'