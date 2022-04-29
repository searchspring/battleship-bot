
start-api:
	sam build
	# sam local start-api
	sam local start-api 2>&1 | tr "\r" "\n"

invoke:
	sam build
	sam local invoke BattleshipFunction -e events.json

init-db:
	aws dynamodb create-table --table-name battleship --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --endpoint-url http://localhost:8000

run-db:
	docker run -p 8000:8000 amazon/dynamodb-local

list-table:
	aws dynamodb list-tables --endpoint-url http://localhost:8000

scan-table:
	aws dynamodb scan --table-name battleship --endpoint-url http://localhost:8000