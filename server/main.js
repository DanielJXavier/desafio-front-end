import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  	getAddressList: function() {
    	var result = HTTP.call('GET', 'http://api-hck.hotmart.com/hack-dragonfly/rest/v1/address', {headers: {Authorization: "Bearer 26f41a25-cd30-400f-be03-53fb6803f2da"}});
    	return result;
	}
});

Meteor.methods({
  	createAddress: function(data) {
    	var result = HTTP.call('POST', 'http://api-hck.hotmart.com/hack-dragonfly/rest/v1/address', {headers: {Authorization: "Bearer 26f41a25-cd30-400f-be03-53fb6803f2da"}, data: data});
    	return result;
	}
});

Meteor.methods({
  	getAddress: function(id) {
    	var result = HTTP.call('GET', 'http://api-hck.hotmart.com/hack-dragonfly/rest/v1/address/' + id, {headers: {Authorization: "Bearer 26f41a25-cd30-400f-be03-53fb6803f2da"}});
    	return result;
	}
});

Meteor.methods({
  	editAddress: function(id, data) {
    	var result = HTTP.call('PUT', 'http://api-hck.hotmart.com/hack-dragonfly/rest/v1/address/' + id, {headers: {Authorization: "Bearer 26f41a25-cd30-400f-be03-53fb6803f2da"}, data: data});
    	return result;
	}
});