# All commands to run the project should be here.
# 
DOCKER = podman
COMPOSER = $(DOCKER)-compose


dev/start:
	npx nodemon -r tsconfig-paths/register ./src/api/index.ts
dev/start/js:
	node ./bundle/api/index.js
dev/lint:
	npx biome check --write ./src

# To Run the tests please start the test enviroment runing:
# when its your first time: make infra/test/build 
# and to start the env: make infra/test/up
# then you can run the following command
dev/test-blackbox:
	make dev/clear
	make infra/blackbox-test/reset
	make infra/blackbox-test/migrate
	make typescript/compile
	node --test

dev/clear:
	rm -rf ./bundle


docker/start: 
	$(DOCKER) run --name picpic -p 8080:8080 -d --replace picpic


typescript/compile:
	npx tsc && npx tsc-alias
typescript/compile-watch:
	npx concurrently --kill-others "tsc -w" "tsc-alias -w"

toolbox/build:
	toolbox run --container js make typescript/compile
	$(DOCKER) build -t pic .

# ___ _   _ _____ ____      _    ____ _____ ____  _   _  ____ _____ _   _ ____   _____ 
#|_ _| \ | |  ___|  _ \    / \  / ___|_   _|  _ \| | | |/ ___|_   _| | | |  _ \ | ____|
# | ||  \| | |_  | |_) |  / _ \ \___ \ | | | |_) | | | | |     | | | | | | |_) ||  _|  
# | || |\  |  _| |  _ <  / ___ \ ___) || | |  _ <| |_| | |___  | | | |_| |  _ < | |___ 
#|___|_| \_|_|   |_| \_\/_/   \_\____/ |_| |_| \_\\___/ \____| |_|  \___/|_| \_\|_____|


DB_MIGRATE_CONFIG = --config ./src/infrastructure/database/configs/local.json --migrations-dir ./src/infrastructure/database/migrations                                                           
infra/up:
	$(COMPOSER) up
infra/up/complete:
	$(COMPOSER) up -d
	sleep 10
	make infra/db/migration/up

infra/up/build:
	$(COMPOSER) up --build -d

infra/down:
	$(COMPOSER) down --remove-orphans -v
infra/enter:
	$(COMPOSER) run node-app sh 

infra/test/build:
	$(COMPOSER) -f docker-compose.test.yaml up --build -d
infra/test/up:
	$(COMPOSER) -f docker-compose.test.yaml down	
	$(COMPOSER) -f docker-compose.test.yaml up -d
infra/test/down:
	$(COMPOSER) -f docker-compose.test.yaml down
infra/test/logs:
	$(COMPOSER) -f docker-compose.test.yaml logs	

infra/test/migrate:
	npx db-migrate up $(DB_MIGRATE_CONFIG) -e test
infra/test/reset:
	npx db-migrate reset $(DB_MIGRATE_CONFIG) -e test
infra/blackbox-test/migrate:
	npx db-migrate up $(DB_MIGRATE_CONFIG) -e blackbox-test
infra/blackbox-test/reset:
	npx db-migrate reset $(DB_MIGRATE_CONFIG) -e blackbox-test




infra/db/migration/create:
	npx db-migrate create migration $(DB_MIGRATE_CONFIG)
infra/db/migration/up:
	npx db-migrate up $(DB_MIGRATE_CONFIG)
infra/db/migration/down:
	npx db-migrate down $(DB_MIGRATE_CONFIG)



# _     ___   ____    _    _     ____ _____  _    ____ _  __
#| |   / _ \ / ___|  / \  | |   / ___|_   _|/ \  / ___| |/ /
#| |  | | | | |     / _ \ | |   \___ \ | | / _ \| |   | ' / 
#| |__| |_| | |___ / ___ \| |___ ___) || |/ ___ \ |___| . \ 
#|_____\___/ \____/_/   \_\_____|____/ |_/_/   \_\____|_|\_\

QUEUE_NAME = transfer-notify
AWS_CLI = aws --endpoint-url=http://localhost:4566
QUEUE_URL = http://localhost:4566/000000000000/$(QUEUE_NAME)

localstack/create-queue:
	@if [ -z "$(QUEUE_NAME)" ]; then \
		read -p "Enter queue name: " queue_name; \
		$(AWS_CLI) sqs create-queue --queue-name $$queue_name; \
	else \
		$(AWS_CLI) sqs create-queue --queue-name $(QUEUE_NAME); \
	fi
localstack/list-queues:
	$(AWS_CLI) sqs list-queues
localstack/send-message:
	$(AWS_CLI) sqs send-message --queue-url $(QUEUE_URL) --message-body $(MESSAGE);
localstack/receive-message:
	$(AWS_CLI) sqs receive-message --queue-url $(QUEUE_URL)
localstack/purge-queue:
	$(AWS_CLI) sqs purge-queue --queue-url $(QUEUE_URL)
