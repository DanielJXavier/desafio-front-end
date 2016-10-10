import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

// Routes
Router.route('/', function () {
	this.render('home');
});
Router.route('/enderecos', function () {
	this.render('enderecos');
});
Router.route('/enderecos/novo', function () {
	this.render('novo_endereco');
});
Router.route('/enderecos/:id', function () {
	this.render('editar_endereco');
});

// Startup
Meteor.startup(function() {
	GoogleMaps.load({key: 'AIzaSyCFLEYpbMY8AfipUrYDPqQCkCJOZgV1ufo'});
	Meteor.call('authenticate', function(err, res) {
		Session.set('authtoken', res.data.token_type[0].toUpperCase() + res.data.token_type.slice(1) + " " + res.data.access_token);
	});
});

// Endereços
Template.enderecos.onCreated(function() {
	Meteor.call('getAddressList', Session.get('authtoken'), function(err, res) {
		res.data.data.reverse();
		Session.set('addressList', res.data.data);
	});
});
Template.enderecos.helpers({
	'addressList': function(){
		return Session.get('addressList');
	}
});

// Novo endereço
Template.novo_endereco.onCreated(function() {
	GoogleMaps.ready('defaultMap', function(map) {
		var geocoder = new google.maps.Geocoder;
		var marker = new google.maps.Marker({
			draggable: true,
			animation: google.maps.Animation.DROP,
			position: map.options.center,
			map: map.instance
		});

		function geocodeLatLng(geocoder, map, latlng) {
			geocoder.geocode({'location': latlng}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK && results.length) {
					var address_components = results[0].address_components;
					for (var i = 0; address_components.length > i; i++) {
						if (address_components[i].types[0] == "route") {
							$("input#address").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "street_number") {
							$("input#number").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "political") {
							$("input#neighborhood").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "locality") {
							$("input#city").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "administrative_area_level_1") {
							$("input#state").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "country") {
							$("input#country").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "postal_code") {
							$("input#zipCode").val(address_components[i].long_name);
						}
					}
					$("input#latitude").val(results[0].geometry.location.lat());
					$("input#longitude").val(results[0].geometry.location.lng());
				}
			});
		}

		function updateMark(event){
			marker.setMap(null);
			marker = new google.maps.Marker({
				animation: google.maps.Animation.DROP,
				draggable: true,
				position: event.latLng,
				map: map.instance
			});

			geocodeLatLng(geocoder, map, event.latLng)
		}
		google.maps.event.addListener(marker, 'dragend', function(event) {
			updateMark(event);
		});
		google.maps.event.addListener(map.instance, 'click', function(event) {
			updateMark(event);
		});
	});
});
Template.novo_endereco.helpers({
	'defaultMapOptions': function() {
		if (GoogleMaps.loaded()) {
			return {
				center: new google.maps.LatLng(-19.935405,-43.9376165),
				zoom: 14,
			};
		}
	}
});
Template.novo_endereco.events({
	'submit #form': function(event) {
		$("#error_message").hide();

		event.preventDefault();

		var data = {};
		data.label = event.target.label.value;
		data.address = event.target.address.value;
		data.number = event.target.number.value;
		data.complement = event.target.complement.value;
		data.neighborhood = event.target.neighborhood.value;
		data.city = event.target.city.value;
		data.state = event.target.state.value;
		data.country = event.target.country.value;
		data.zipCode = event.target.zipCode.value;
		data.latitude = event.target.latitude.value ? event.target.latitude.value : 0;
		data.longitude = event.target.longitude.value ? event.target.longitude.value : 0;

		Meteor.call('createAddress', Session.get('authtoken'), data, function(err, res) {
			if (err) {
				$("#error_message").fadeIn("slow");
			} else {
				Router.go('/enderecos');
			}
		});
	}
});

// Editar endereço
Template.editar_endereco.onCreated(function() {
	Meteor.call('getAddress', Session.get('authtoken'), Router.current().params.id, function(err, res) {
		if (err) {
			Router.go('/enderecos/novo');
		} else {
			for (prop in res.data) {
				Session.set(prop, res.data[prop]);
				$("input#" + prop).val(res.data[prop]);
			}
		}
	});

	GoogleMaps.ready('defaultMap', function(map) {
		var geocoder = new google.maps.Geocoder;
		var marker = new google.maps.Marker({
			draggable: true,
			animation: google.maps.Animation.DROP,
			position: map.options.center,
			map: map.instance
		});

		function geocodeLatLng(geocoder, map, latlng) {
			geocoder.geocode({'location': latlng}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK && results.length) {
					var address_components = results[0].address_components;
					for (var i = 0; address_components.length > i; i++) {
						if (address_components[i].types[0] == "route") {
							$("input#address").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "street_number") {
							$("input#number").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "political") {
							$("input#neighborhood").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "locality") {
							$("input#city").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "administrative_area_level_1") {
							$("input#state").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "country") {
							$("input#country").val(address_components[i].long_name);
						}
						else if (address_components[i].types[0] == "postal_code") {
							$("input#zipCode").val(address_components[i].long_name);
						}
					}
					$("input#latitude").val(results[0].geometry.location.lat());
					$("input#longitude").val(results[0].geometry.location.lng());
				}
			});
		}

		function updateMark(event){
			marker.setMap(null);
			marker = new google.maps.Marker({
				animation: google.maps.Animation.DROP,
				draggable: true,
				position: event.latLng,
				map: map.instance
			});

			geocodeLatLng(geocoder, map, event.latLng)
		}
		google.maps.event.addListener(marker, 'dragend', function(event) {
			updateMark(event);
		});
		google.maps.event.addListener(map.instance, 'click', function(event) {
			updateMark(event);
		});
	});
});
Template.editar_endereco.helpers({
	'defaultMapOptions': function() {
		if (GoogleMaps.loaded() && Session.get('latitude') && Session.get('longitude')) {
			return {
				center: new google.maps.LatLng(Session.get('latitude'), Session.get('longitude')),
				zoom: 17,
			};
		}
	},
	'label': function(){
		return Session.get('label');
	}
});
Template.editar_endereco.events({
	'submit #form': function(event) {
		$("#error_message").hide();

		event.preventDefault();

		var id = Session.get("id");
		var data = {};
		data.availableItems = [];
		data.label = event.target.label.value;
		data.address = event.target.address.value;
		data.number = event.target.number.value;
		data.complement = event.target.complement.value;
		data.neighborhood = event.target.neighborhood.value;
		data.city = event.target.city.value;
		data.state = event.target.state.value;
		data.country = event.target.country.value;
		data.zipCode = event.target.zipCode.value;
		data.latitude = event.target.latitude.value ? event.target.latitude.value : 0;
		data.longitude = event.target.longitude.value ? event.target.longitude.value : 0;

		Meteor.call('editAddress', Session.get('authtoken'), id, data, function(err, res) {
			if (err) {
				$("#error_message").fadeIn("slow");
			} else {
				Router.go('/enderecos');
			}
		});
	}
});