"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
const router_1 = require("./router");
class ModelRouter extends router_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.pageSize = 2;
        this.validateId = (req, res, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError("Document not found"));
            }
            else {
                next();
            }
        };
        this.findAll = (req, res, next) => {
            let page = parseInt(req.query._page || 1);
            page = page > 0 ? page : 1;
            const skip = (page - 1) * this.pageSize;
            this.model
                .countDocuments({})
                .exec()
                .then(count => {
                this.model
                    .find()
                    .skip(skip)
                    .limit(this.pageSize)
                    .then(this.renderAll(res, next, {
                    page,
                    count,
                    pageSize: this.pageSize,
                    url: req.url
                }))
                    .catch(next);
            });
        };
        this.findById = (req, res, next) => {
            this.model
                .findById(req.params.id)
                .then(this.render(res, next))
                .catch(next);
        };
        this.save = (req, res, next) => {
            let document = new this.model(req.body);
            document
                .save()
                .then(this.render(res, next))
                .catch(next);
        };
        this.replace = (req, res, next) => {
            const options = {
                overwrite: true,
                runValidators: true,
                new: true
            };
            this.model
                .findOneAndUpdate({ _id: req.params.id }, req.body, options)
                .then(this.render(res, next))
                .catch(next);
        };
        this.update = (req, res, next) => {
            const options = { new: true, runValidators: true };
            this.model
                .findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(res, next))
                .catch(next);
        };
        this.delete = (req, res, next) => {
            this.model
                .deleteOne({ _id: req.params.id })
                .exec()
                .then((result) => {
                if (result.ok) {
                    res.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError("Document not found");
                }
                return next();
            })
                .catch(next);
        };
        this.basePath = `/${model.collection.name}`;
    }
    envelop(document) {
        let resource = Object.assign({
            _links: {}
        }, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }
    envelopAll(documents, options = {}) {
        const resource = {
            _links: {
                self: `${options.url}`
            },
            items: documents
        };
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`;
            }
            const remaining = options.count - options.page * options.pageSize;
            if (remaining > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
            }
        }
        return resource;
    }
}
exports.ModelRouter = ModelRouter;
