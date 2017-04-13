/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  'new': function(req, res) {
    res.view('user/new', {layout: 'layout.ejs'});
  },
	create: function(req, res) {
	  console.log('received create')
	  return User.create(req.params)
	},
	test: function(req, res) {
	  return req.params
	},
	get: function(req, res) {
	  res.view('user/read', {layout: 'layout.ejs'})
	}
};