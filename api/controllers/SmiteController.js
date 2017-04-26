const Hirez = require('../../node_modules/hirez.js/hirez.js')
const hirezAuth = require('../../config/hirez.js')

module.exports = {
  'new': function(req, res) {
    res.view('user/new', {layout: 'layout.ejs'});
  },
	create: function(req, res) {
	  return User.create(req.params)
	},
	test: function(req, res) {
	  return req.params
	},
	get: function(req, res) {
	  res.view('smite/read', {layout: 'layout.ejs'})
	},
	request: function(req, res) {
    if(req.session.hirez) {
      return JSON.stringify()
    } else {
      req.session.hirez = new Hirez(hirezAuth);
      req.session.hirez.smite.session.generate()
        .then((res) => {
          return JSON.stringify({
            ret_msg: 'Successfully started session ' + res
          })
        })
      return JSON.stringify({
        ret_msg: 'Failed to establish session'
      })
    }
	}
};