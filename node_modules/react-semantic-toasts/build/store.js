"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var Store = function () {function Store() {_classCallCheck(this, Store);this.
        subscribers = [];this.

        items = [];}_createClass(Store, [{ key: "subscribe", value: function subscribe(

        cb) {
            this.subscribers.push(cb);
        } }, { key: "unsubscribe", value: function unsubscribe(

        cb) {
            this.subscribers = this.subscribers.filter(
            function (subscriber) {return subscriber !== cb ? subscriber : undefined;});

        } }, { key: "notify", value: function notify()

        {
            this.subscribers.forEach(function (subscriber) {return subscriber();});
        } }, { key: "add", value: function add(

        item) {
            this.items.push(item);
            this.notify();
        } }, { key: "remove", value: function remove(

        item) {
            this.items = this.items.filter(function (storeItem) {return storeItem !== item ? storeItem : undefined;});
            this.notify();
        } }, { key: "data", get: function get()

        {
            return this.items;
        } }]);return Store;}();exports.default =


Store;