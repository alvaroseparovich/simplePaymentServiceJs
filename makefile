AWS_CLI = aws --endpoint-url=http://localhost:4566
QUEUE_NAME = first-queue
QUEUE_URL = http://localhost:4566/000000000000/$(QUEUE_NAME)

export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1

# .PHONY: create-queue list-queues send-message receive-message

build:
	toolbox run --container js npx tsc
	podman build -t pic .
developing:
	toolbox run --container js npx tsc --watch
	
infra/up:
	podman-compose up
infra/up/build:
	podman-compose up --build
infra/down:
	podman-compose down
infra/enter:
	podman-compose run node-app sh 

localstack/create-queue:
	$(AWS_CLI) sqs create-queue --queue-name $(QUEUE_NAME)
localstack/list-queues:
	$(AWS_CLI) sqs list-queues
localstack/send-message:
	$(AWS_CLI) sqs send-message --queue-url $(QUEUE_URL) --message-body "Hello, World!"
localstack/receive-message:
	$(AWS_CLI) sqs receive-message --queue-url $(QUEUE_URL)