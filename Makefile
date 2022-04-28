
start-api:
	sam build
	sam local start-api

invoke:
	sam build
	sam local invoke BattleshipFunction -e events.json
