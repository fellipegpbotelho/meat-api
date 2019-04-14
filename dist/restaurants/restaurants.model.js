"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});
const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    manu: {
        type: [MenuSchema],
        required: false,
        select: false,
        default: []
    }
});
exports.Restaurant = mongoose.model("Restaurant", RestaurantSchema);
