module.exports.routes = {
  '/': {
    view: 'homepage'
  },
  'post /users': 'UserController.create',
  'get /users': 'UserController.get',
  'get /users': 'UserController.get',
  'get /demo': {
    view: 'demo'
  }
};