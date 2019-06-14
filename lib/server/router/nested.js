"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const _ = require('lodash');

const express = require('express');

const pluralize = require('pluralize');

const delay = require('./delay');

module.exports = opts => {
  const router = express.Router();
  router.use(delay); // Rewrite URL (/:resource/:id/:nested -> /:nested) and request query

  function get(req, res, next) {
    const prop = pluralize.singular(req.params.resource);
    req.query[`${prop}${opts.foreignKeySuffix}`] = req.params.id;
    req.url = `/${req.params.nested}`;
    next();
  } // Rewrite URL (/:resource/:id/:nested -> /:nested) and request body


  function post(req, res, next) {
    const id = parseInt(req.params.id);
    const prop = pluralize.singular(req.params.resource) + opts.foreignKeySuffix;

    if (_.isArray(req.body)) {
      req.body = req.body.map(r => _objectSpread({}, r, {
        [prop]: id
      }));
    } else {
      req.body[prop] = id;
    }

    req.url = `/${req.params.nested}`;
    next();
  }

  return router.get('/:resource/:id/:nested', get).post('/:resource/:id/:nested', post);
};