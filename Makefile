.DEFAULT_GOAL := help
.PHONY: help install dev api gen test test-front test-back lint lint-back format typecheck check smoke build push clean

PY := backend/.venv/bin/python

help: ## List targets
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | sed -E 's/:.*## /\t/' | sort

install: ## Install frontend deps + create backend venv
	bun install
	python3 -m venv backend/.venv
	$(PY) -m pip install -q -r backend/requirements.txt

dev: ## Run the frontend (Vite)
	bun run dev

api: ## Run the backend (FastAPI, port 8000)
	cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000

gen: ## Regenerate OpenAPI spec + typed client (after a backend change)
	bun run dump:api
	bun run gen:api

test: test-front test-back ## Run all tests

test-front: ## Frontend tests (vitest)
	bun run test

test-back: ## Backend pure tests
	$(PY) backend/tests/test_pure.py

lint: lint-back ## ESLint (front) + ruff (backend)
	bun run lint

lint-back: ## Ruff (backend)
	backend/.venv/bin/ruff check backend

format: ## Prettier write
	bun run format

typecheck: ## TypeScript, no emit
	bunx tsc --noEmit

check: typecheck lint test ## Typecheck + lint + tests (CI-like)

smoke: ## Smoke test against a running backend (make api first)
	bash backend/scripts/smoke.sh

build: ## Production build (Nitro)
	bun run build

push: ## Push current branch to origin
	git push origin HEAD

clean: ## Remove build output and caches
	rm -rf .output .vinxi dist backend/__pycache__ backend/app/__pycache__ backend/.pytest_cache
