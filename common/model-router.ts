import * as mongoose from "mongoose";
import { NotFoundError } from "restify-errors";

import { Router } from "./router";

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
  constructor(protected model: mongoose.Model<D>) {
    super();
  }

  validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError("Document not found"));
    } else {
      next();
    }
  };

  findAll = (req, res, next) => {
    this.model
      .find()
      .then(this.renderAll(res, next))
      .catch(next);
  };

  findById = (req, res, next) => {
    this.model
      .findById(req.params.id)
      .then(this.render(res, next))
      .catch(next);
  };

  save = (req, res, next) => {
    let document = new this.model(req.body);
    document
      .save()
      .then(this.render(res, next))
      .catch(next);
  };

  replace = (req, res, next) => {
    const options = {
      overwrite: true,
      runValidators: true
    };
    this.model
      .update({ _id: req.params.id }, req.body, options)
      .exec()
      .then(result => {
        if (result.n) {
          return this.model.findById(req.params.id);
        } else {
          throw new NotFoundError("Document not found");
        }
      })
      .then(this.render(res, next))
      .catch(next);
  };

  update = (req, res, next) => {
    const options = { new: true, runValidators: true };
    this.model
      .findByIdAndUpdate(req.params.id, req.body, options)
      .then(this.render(res, next))
      .catch(next);
  };

  delete = (req, res, next) => {
    this.model
      .remove({ _id: req.params.id })
      .exec()
      .then((commandResult: any) => {
        if (commandResult.result.n) {
          res.send(204);
        } else {
          throw new NotFoundError("Document not found");
        }
        return next();
      })
      .catch(next);
  };
}