"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const server = restify.createServer({
    name: "meat-api",
    version: "1.0.0"
});
server.use(restify.plugins.queryParser());
server.get("/info", [
    (req, res, next) => {
        if (req.userAgent() && req.userAgent().includes("MSIE 7.0")) {
            // res.status(400);
            // res.json({ message: "Please, update your browser" });
            // return next(false);
            let error = new Error();
            error.statusCode = 400;
            error.message = "Please, update your browser";
            return next(error);
        }
        return next();
    },
    (req, res, next) => {
        // res.contentType = "application/json"; ou res.setHeader("Content-Type", "application/json");
        // res.send({ message: "Hello from MEAT-API" });
        // res.status(200);
        res.json({
            message: "Hello from MEAT-API",
            browser: req.userAgent(),
            method: req.method,
            url: req.href(),
            path: req.path(),
            query: req.query
        });
        return next();
    }
]);
const SERVER_PORT = 3000;
server.listen(SERVER_PORT, () => {
    console.log(`MEAT API is running on http://localhost:${SERVER_PORT}`);
});
