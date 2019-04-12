import * as restify from "restify";
import * as mongoose from "mongoose";

import { environment } from "../common/environment";
import { Router } from "../common/router";
import { mergePatchBodyParser } from "./merge-patch.parser";
import { handleError } from "./error.handler";

export class Server {
  application: restify.Server;

  initializeDatabase(): mongoose.MongooseThenable {
    (<any>mongoose).Promise = global.Promise;
    return mongoose.connect(environment.db.url, {
      useMongoClient: true
    });
  }

  initializeRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: "meat-api",
          version: "1.0.0"
        });

        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);

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
}
