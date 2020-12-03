.PHONY: clean build

SRC_DIR=visitation/static/src/js
LIB_DIR=visitation/static/lib
BABEL_IN_DIR=$(LIB_DIR)/src
BABEL_OUT_DIR=$(LIB_DIR)/compiled
BUILD_CMD=npm run build

clean:
	rm -rf $(LIB_DIR)
	mkdir -p $(BABEL_IN_DIR) $(BABEL_OUT_DIR)

build: $(BABEL_IN_DIR)/visitationAppAll.js

$(BABEL_IN_DIR)/visitationAppAll.js: $(SRC_DIR)/visitationAppIO.js $(SRC_DIR)/visitationAppBase.js $(SRC_DIR)/visitationAppStepper.js $(SRC_DIR)/visitationAppResidentForm.js $(SRC_DIR)/visitationAppVisitorForm.js $(SRC_DIR)/visitationAppSchedulingForm.js $(SRC_DIR)/visitationAppResultsForm.js $(SRC_DIR)/visitationAppMain.js $(SRC_DIR)/visitationApp.js
	cat $(SRC_DIR)/visitationAppIO.js > $(BABEL_IN_DIR)/visitationAppAll.js
	cat $(SRC_DIR)/visitationAppBase.js >> $(BABEL_IN_DIR)/visitationAppAll.js
	cat $(SRC_DIR)/visitationAppStepper.js >> $(BABEL_IN_DIR)/visitationAppAll.js
	cat $(SRC_DIR)/visitationAppResidentForm.js >> $(BABEL_IN_DIR)/visitationAppAll.js
	cat $(SRC_DIR)/visitationAppVisitorForm.js >> $(BABEL_IN_DIR)/visitationAppAll.js
	cat $(SRC_DIR)/visitationAppSchedulingForm.js >> $(BABEL_IN_DIR)/visitationAppAll.js
	cat $(SRC_DIR)/visitationAppResultsForm.js >> $(BABEL_IN_DIR)/visitationAppAll.js
	cat $(SRC_DIR)/visitationAppMain.js >> $(BABEL_IN_DIR)/visitationAppAll.js
	cat $(SRC_DIR)/visitationApp.js >> $(BABEL_IN_DIR)/visitationAppAll.js 

$(BABEL_OUT_DIR)/visitationAppAllCompiled.js: $(BABEL_IN_DIR)/visitationAppAll.js
	$(BUILD_CMD)




