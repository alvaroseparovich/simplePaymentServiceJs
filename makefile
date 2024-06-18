# export AWS_ACCESS_KEY_ID=test
# export AWS_SECRET_ACCESS_KEY=test
# export AWS_DEFAULT_REGION=us-east-1

# .PHONY: create-queue list-queues send-message receive-message

build:
	toolbox run --container js npx tsc
	podman build -t pic .
developing:
	toolbox run --container js npx tsc --watch
	
# ___ _   _ _____ ____      _    ____ _____ ____  _   _  ____ _____ _   _ ____   _____ 
#|_ _| \ | |  ___|  _ \    / \  / ___|_   _|  _ \| | | |/ ___|_   _| | | |  _ \ | ____|
# | ||  \| | |_  | |_) |  / _ \ \___ \ | | | |_) | | | | |     | | | | | | |_) ||  _|  
# | || |\  |  _| |  _ <  / ___ \ ___) || | |  _ <| |_| | |___  | | | |_| |  _ < | |___ 
#|___|_| \_|_|   |_| \_\/_/   \_\____/ |_| |_| \_\\___/ \____| |_|  \___/|_| \_\|_____|

COMPOSER = podman-compose                                                                
infra/up:
	$(COMPOSER) up
infra/up/build:
	$(COMPOSER) up --build
infra/down:
	$(COMPOSER) down
infra/enter:
	$(COMPOSER) run node-app sh 

DB_MIGRATE_CONFIG = --config ./src/infrastructure/database/configs/local.json --migrations-dir ./src/infrastructure/database/migrations
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

AWS_CLI = aws --endpoint-url=http://localhost:4566
QUEUE_NAME = first-queue
QUEUE_URL = http://localhost:4566/000000000000/$(QUEUE_NAME)

localstack/create-queue:
	$(AWS_CLI) sqs create-queue --queue-name $(QUEUE_NAME)
localstack/list-queues:
	$(AWS_CLI) sqs list-queues
localstack/send-message:
	$(AWS_CLI) sqs send-message --queue-url $(QUEUE_URL) --message-body "Hello, World!"
localstack/receive-message:
	$(AWS_CLI) sqs receive-message --queue-url $(QUEUE_URL)