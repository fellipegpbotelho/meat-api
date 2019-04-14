import * as restify from "restify";
import { NotFoundError } from "restify-errors";
import { EventEmitter } from "events";

export abstract class Router extends EventEmitter {
  abstract applyRoutes(application: restify.Server);

  envelop(document: any): any {
    return document;
  }

  render(response: restify.Response, next: restify.Next) {
    return document => {
      if (document) {
        this.emit("beforeRender", document);
        response.json(this.envelop(document));
      } else {
        throw new NotFoundError("Document not found");
      }
      return next();
    };
  }

  renderAll(response: restify.Response, next: restify.Next) {
    return (documents: any[]) => {
      if (documents) {
        documents.forEach((document, index, array) => {
          this.emit("beforeRender", document);
          array[index] = this.envelop(document);
        });
        response.json(documents);
      } else {
        response.json([]);
      }
      return next();
    };
  }
}
