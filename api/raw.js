#!/usr/bin/env node

module.exports = (req, res) => {
  res.json({
    url: req.url,
    headers: req.headers,
    method: req.method
  })
}
