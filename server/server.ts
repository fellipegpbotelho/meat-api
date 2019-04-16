import * as restify from "restify";
import * as mongoose from "mongoose";
import * as fs from "fs";

import { Router } from "../common/router";
import { handleError } from "./error.handler";
import { environment } from "../common/environment";
import { tokenParser } from "../security/token.parser";
import { mergePatchBodyParser } from "./merge-patch.parser";

export class Server {
  application: restify.Server;

  initializeDatabase(): mongoose.MongooseThenable {
    (<any>mongoose).Promise = global.Promise;
    return mongoose.connect(environment.db.url, {
      useNewUrlParser: true,
      useCreateIndex: true
    });
  }

  initializeRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: "meat-api",
          version: "1.0.0",
          key: fs.readFileSync("./security/keys/key.pem"),
          certificate: fs.readFileSync("./security/keys/cert.pem")
        });

        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);
        this.application.use(tokenParser);

        for (let router of routers) {
          router.applyRoutes(this.application);
        }

        this.application.listen(environment.server.port, () => {
          resolve(this.application);
        });

        this.application.on("restifyError", handleError);
      } catch (error) {
        reject(error);
      }
    });
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDatabase().then(() =>
      this.initializeRoutes(routers).then(() => this)
    );
  }

  shutdown() {
    return mongoose.disconnect().then(() => this.application.close());
  }
}
