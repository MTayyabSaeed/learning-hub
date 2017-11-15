module.exports = {
  name: 'data'
, body: String
, headers: { loaded: loaded }
}

function loaded() {
  global.loadedResdir = arguments
}