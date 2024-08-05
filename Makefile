.DEFAULT_GOAL := help

## @description プロジェクトをインストールします
## @usage make install
install:
	@if [ ! -f .env ]; then cp .env.example .env; fi
	@make up
	@make i
	@make fresh
	@make dev

## @description プロジェクトをリセットします
## @usage make reset
reset:
	rm -rf node_modules
	rm -rf .next
	@make destroy
	@make install

## @description ローカルサーバーを起動します
## @usage make dev
dev:
	@make up
	npm run dev

## @description プロジェクトをビルドします
## @usage make build
build:
	rm -rf node_modules
	rm -rf .next
	@make up
	@make i
	npm run with-env -- npm run build
	npm run with-env -- npm run start

## @description DBコンテナを起動します
## @usage make up
up:
	docker compose up -d

## @description 全てのコンテナを削除します
## @usage make destroy
destroy:
	docker compose down -v --remove-orphans --rmi all

## @description コンテナの状態を表示します
## @usage make ps
ps:
	docker compose ps

## @description ライブラリをインストールします
## @usage make i
i:
	npm install

## @description dependenciesに指定されたライブラリを追加します
## @usage make package something1 something2
package:
	@libs='$(filter-out $@,$(MAKECMDGOALS))'; \
	if [ ! -z "$$libs" ]; then \
		npm install $$libs; \
	fi

## @description devDependenciesに指定されたライブラリを追加します
## @usage make package-dev something1 something2
package-dev:
	@libs='$(filter-out $@,$(MAKECMDGOALS))'; \
	if [ ! -z "$$libs" ]; then \
		npm install -D $$libs; \
	fi

## @description eslintを実行します
## @usage make lint
lint:
	npm run eslint:fix

## @description フォーマットします
## @usage make format
format:
	npm run format:fix

## @description CIを実行します
## @usage make ci
ci:
	npm run ci

## @description DBコンテナに入ります
## @usage make db-sh
db-sh:
	docker compose exec db psql -U postgres -d local

## @description マイグレーションを実行します
## @usage make migrate
migrate:
	npm run prisma:migrate

## @description データベースをリセットします
## @usage make fresh
fresh:
	npm run prisma:reset
	npm run prisma:generate
	npm run prisma:seed

help:
	@printf "\n\033[33m%-30s\033[0m %s\n\n" "コマンド一覧:"
	@awk 'BEGIN { description = ""; usage = ""; } \
		/^## @description/ { description = substr($$0, index($$0, $$3)); } \
		/^## @usage/ { usage = substr($$0, index($$0, $$3)); } \
		/^[a-zA-Z0-9_\-]+:/ { \
			helpCommand = $$1; \
			if (description != "") { \
				printf "  \033[32m%-30s\033[0m %s\n", helpCommand, description; \
				if (usage != "") { \
					printf "  \033[36m%-30s\033[0m %s%s\n\n", "", "▶️ ", usage; \
				} \
			} \
			description = ""; usage = ""; \
		}' $(MAKEFILE_LIST)

%:
	@:
