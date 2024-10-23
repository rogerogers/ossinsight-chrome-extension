NAME=`cat package.json| jq '.name + "-" + .version'`
.PHONY: echo-name
echo-name:
	@echo ${NAME}
