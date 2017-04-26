module.exports.routes = {
  '/': {
    view: 'homepage'
  },
  'post /users': 'UserController.create',
  'get /users': 'UserController.get',
  'get /users': 'UserController.get',
  'get /smite': 'SmiteController.get',
  'post /smite/request/:method': 'SmiteController.request',
  'get /demo': {
    view: 'demo'
  }
};