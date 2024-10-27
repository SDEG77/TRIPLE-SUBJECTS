// Simple shim for Tableau Web Data Connector version 2.1.0

(function () {
    if (typeof window === "undefined") {
        throw new Error("This library only works in a browser");
    }

    window.tableau = window.tableau || {};

    tableau.makeConnector = function () {
        return {
            init: function (initCallback) {
                initCallback();
            },
            getSchema: function (schemaCallback) {
                // Default no-op
                schemaCallback([]);
            },
            getData: function (table, doneCallback) {
                // Default no-op
                doneCallback();
            }
        };
    };

    tableau.submit = function () {
        if (typeof tableau.connectionName === "undefined") {
            throw new Error("You must specify tableau.connectionName before submitting");
        }
        // Assuming we can submit since this is a mock implementation
        console.log("Data source submitted with name: " + tableau.connectionName);
    };

    tableau.abortWithError = function (errorMessage) {
        console.error("Tableau aborted with error: " + errorMessage);
    };

    tableau.registerConnector = function (connector) {
        window._tableauConnector = connector;
    };

    tableau.connectionName = "Sample WDC";
})();
