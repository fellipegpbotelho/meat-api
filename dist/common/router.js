"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const events_1 = require("events");
class Router extends events_1.EventEmitter {
    envelop(document) {
        return document;
    }
    envelopAll(documents, options = {}) {
        return documents;
    }
    render(response, next) {
        return document => {
            if (document) {
                this.emit("beforeRender", document);
                response.json(this.envelop(document));
            }
            else {
                throw new restify_errors_1.NotFoundError("Document not found");
            }
            return next();
        };
    }
    renderAll(response, next, options = {}) {
        return (documents) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit("beforeRender", document);
                    array[index] = this.envelop(document);
                });
                response.json(this.envelopAll(documents, options));
            }
            else {
                response.json(this.envelopAll([], options));
            }
            return next();
        };
    }
}
exports.Router = Router;
