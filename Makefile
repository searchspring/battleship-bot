
start-api:
	sam build
	# sam local start-api
	sam local start-api 2>&1 | tr "\r" "\n"

invoke:
	sam build
	sam local invoke BattleshipFunction -e events.json

init-db:
	aws dynamodb create-table --table-name battleship --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --endpoint-url http://localhost:8000
