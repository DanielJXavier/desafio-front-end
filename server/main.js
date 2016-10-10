import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
    authenticate: function() {
      var result = HTTP.call('POST', 'http://api-hck.hotmart.com/security/oauth/token?grant_type=password&username=desafio.front@hotmart.com.br&password=123456', {headers: {Authorization: "Basic  ZTZiZGVjY2ItNzM1OC00OTk3LWIzYzAtODk2NDBhZjEyZGRlOmQ5OWNmMTU0LTFjZGYtNDRiMi04MDJmLWU1YzhiYmU5NjY5OA=="}});
      return result;
  }
});

Meteor.methods({
  	getAddressList: function(token) {
    	var result = HTTP.call('GET', 'http://api-hck.hotmart.com/hack-dragonfly/rest/v1/address', {headers: {Authorization: token}});
    	return result;
	}
});

Meteor.methods({
  	createAddress: function(token, data) {
    	var result = HTTP.call('POST', 'http://api-hck.hotmart.com/hack-dragonfly/rest/v1/address', {headers: {Authorization: "Bearer 26f41a25-cd30-400f-be03-53fb6803f2da"}, data: data});
    	return result;
	}
});

Meteor.methods({
  	getAddress: function(token, id) {
    	var result = HTTP.call('GET', 'http://api-hck.hotmart.com/hack-dragonfly/rest/v1/address/' + id, {headers: {Authorization: "Bearer 26f41a25-cd30-400f-be03-53fb6803f2da"}});
    	return result;
	}
});

Meteor.methods({
  	editAddress: function(token, id, data) {
    	var result = HTTP.call('PUT', 'http://api-hck.hotmart.com/hack-dragonfly/rest/v1/address/' + id, {headers: {Authorization: "Bearer 26f41a25-cd30-400f-be03-53fb6803f2da"}, data: data});
    	return result;
	}
});