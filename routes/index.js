module.exports = function(app, db) {
    function importRoute(routeName) {
        var str = './'+routeName;
        var routeModule = require(str);

        app.use(routeModule(db));
    }

    importRoute('default');
    importRoute('distributions');
    importRoute('markerSites');
    importRoute('authentication');
};
