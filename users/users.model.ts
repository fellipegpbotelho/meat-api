import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

import { environment } from "../common/environment";
import { validateCPF } from "../common/validators";

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  gender: {
    type: String,
    required: false,
    enum: ["Male", "Female"]
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validateCPF,
      message: "{PATH}: Invalid CPF ({VALUE})"
    }
  }
});

const hashPassword = (object, next) => {
  bcrypt
    .hash(object.password, environment.security.saltRounds)
    .then(hash => {
      object.password = hash;
      next();
    })
    .catch(next);
};

const saveMiddleware = function(next) {
  const user: User = this;
  if (!user.isModified("password")) {
    next();
  } else {
    hashPassword(user, next);
  }
};

const updateMiddleware = function(next) {
  if (!this.getUpdate().password) {
    next();
  } else {
    hashPassword(this.getUpdate(), next);
  }
};

UserSchema.pre("save", saveMiddleware);
UserSchema.pre("update", updateMiddleware);
UserSchema.pre("findOneAndUpdate", updateMiddleware);

export const User = mongoose.model<User>("User", UserSchema);
