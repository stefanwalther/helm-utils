help:															## Show this help.
	@echo ''
	@echo 'Available commands:'
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo ''
.PHONY: help

## Todo: dockerize this thing here ...
gen-api-docs: 										## Generate the API docs to ./docs/api.md
	node ./node_modules/.bin/documentation build --format md --output ./docs/api.md
.PHONY: gen-api-docs

gen-api-docs-watch: 										## Generate the API docs to ./docs/api.md
	node ./node_modules/.bin/documentation build --format md --output ./docs/api.md --watch
.PHONY: gen-api-docs-watch

gen-readme: gen-api-docs					## Generate README.md (using docker-verb)
	docker run --rm -v ${PWD}:/opt/verb stefanwalther/verb
.PHONY: gen-readme
