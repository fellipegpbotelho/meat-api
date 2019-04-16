"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const fs = require("fs");
const error_handler_1 = require("./error.handler");
const environment_1 = require("../common/environment");
const token_parser_1 = require("../security/token.parser");
const merge_patch_parser_1 = require("./merge-patch.parser");
class Server {
    initializeDatabase() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
    }
    initializeRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                const options = {
                    name: "meat-api",
                    version: "1.0.0"
                };
                if (environment_1.environment.security.enableHTTPS) {
                    options.key = fs.readFileSync(environment_1.environment.security.key);
                    options.certificate = fs.readFileSync(environment_1.environment.security.certificate);
                }
                this.application = restify.createServer(options);
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                this.application.use(token_parser_1.tokenParser);
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
                this.application.on("restifyError", error_handler_1.handleError);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDatabase().then(() => this.initializeRoutes(routers).then(() => this));
    }
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
