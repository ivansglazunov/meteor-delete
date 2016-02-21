if (Meteor.isServer) {
	Meteor.methods({
		'ivansglazunov:delete/undelete': function(ref) {
			var collection = Mongo.Collection.get(ref.collection);
			var config = collections[ref.collection];
			var $set = {};
			$set[config.field] = false;
			if (config.history) {
				var result = collection.direct.update(ref.id, { $set:$set });
				if (result) {
					var user = Meteor.users.findOne(this.userId);
					History.insert({ 
				        ref: { collection: collection._name, id: ref.id },
				        type: 'undelete',
				        user: user?user.Ref():undefined
					});
				}
			}
		},
		'ivansglazunov:delete/delete': function(ref) {
			var collection = Mongo.Collection.get(ref.collection);
			var config = collections[ref.collection];
			var $set = {};
			$set[config.field] = true;
			if (config.history) {
				var result = collection.direct.update(ref.id, { $set:$set });
				if (result) {
					var user = Meteor.users.findOne(this.userId);
					History.insert({ 
				        ref: { collection: collection._name, id: ref.id },
				        type: 'delete',
				        user: user?user.Ref():undefined
					});
				}
			}
		}
	});
}

var collections = {};

Mongo.Collection.prototype.attachDelete = function(config) {
	
	if (this._name in collections) 
		throw new Meteor.Error('Delete already attached to collection '+this._name+'.');
	
	var config = lodash.defaults(config, {
		undelete: true,
		collectionHelpers: true,
		documentHelpers: true,
		schema: true,
		field: '_deleted',
		hidden: true,
		history: true
	});
	
	collections[this._name] = config;
	
	var collection = this;
	
	if (config.schema) {
		var schema = {};
		schema[config.field] = {
			type: Boolean,
			defaultValue: false
		};
		collection.attachSchema(new SimpleSchema(schema));
	}
	
	if (config.collectionHelpers) {
		collection.delete = function(_id) {
			Meteor.call('ivansglazunov:delete/delete', { collection: collection._name, id: _id });
		};
		collection.undelete = function(_id) {
			Meteor.call('ivansglazunov:delete/undelete', { collection: collection._name, id: _id });
		};
	}
	
	if (config.documentHelpers) {
		collection.helpers({
			delete: function() {
				collection.delete(this._id);
			}
		});
	}
	
	collection.deny({
		insert: function(userId, doc) {
			if (doc[config.field])
				throw new Meteor.Error('Deleted document is forbidden for insert');
		},
		update: function(userId, doc, fieldNames) {
			if (lodash.includes(fieldNames, config.field))
				throw new Meteor.Error('Manually update the field '+config.field+' is forbidden');
		}
	});
	
	if (config.hidden) {
		var before = function (userId, selector, options) {
			if (typeof(selector) == 'object') {
				selector[config.field] = { $ne: true };
			}
		};
		collection.before.find(before);
		collection.before.findOne(before);
	}
};

if (Meteor.isClient) {
	Template.delete.events({
		'click': function(event, template) {
			if (template.data.Ref) var document = template.data;
			else if (template.data.document) var document = template.data.document;
			if (document) {
				var collection = Mongo.Collection.get(document.Ref().collection);
				if (collection) collection.delete(document._id);
			}
		}
	});
}