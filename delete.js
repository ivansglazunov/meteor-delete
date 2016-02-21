Mongo.Collection.prototype.attachDelete = function(config) {
	var config = lodash.defaults(config, {
		insert: false,
		change: false,
		undelete: false,
		method: true,
		helper: true,
		schema: true,
		field: '_deleted',
		hidden: true,
		history: true
	});
	var collection = this;
	if (config.schema) {
		var schema = {};
		schema[config.field] = {
			type: Boolean,
			defaultValue: false
		};
		collection.attachSchema(new SimpleSchema(schema));
	}
	if (config.method) {
		collection.delete = function(_id) {
			var $set = {};
			$set[config.field] = true;
			collection.update(_id, { $set:$set });
		};
	}
	if (config.helper) {
		collection.helpers({
			delete: function() {
				var $set = {};
				$set[config.field] = true;
				collection.update(this._id, { $set:$set });
			}
		});
	}
	if (!config.insert) {
		collection.deny({
			insert: function(userId, doc) {
				if (doc[config.field])
					throw new Meteor.Error('Deleted document is insert');
			}
		});
	}
	if (!config.change) {
		collection.deny({
			update: function(userId, doc, fields, modifier) {
				if (config.field in doc && fields.length > 1 && fields[0] != config.field)
					throw new Meteor.Error('Deleted document is change');
			}
		});
	}
	if (!config.undelete) {
		collection.deny({
			update: function(userId, doc, fields, modifier) {
				if (config.field in doc && lodash.includes(fields, config.field))
					throw new Meteor.Error('Deleted document is undeletable');
			}
		});
	}
	if (config.hidden) {
		var before = function (userId, selector, options) {
			if (typeof(selector) == 'object') {
				selector[config.field] = { $not: { $eq: true } };
			}
		};
		collection.before.find(before);
		collection.before.findOne(before);
	}
	if (config.history && Meteor.isServer) {
		collection.after.update(function(userId, doc) {
		    var doc = collection._transform(doc);
			if (!this.previous.deleted && doc.deleted) {
				History.insert({
			        ref: doc.Ref(),
			        type: 'delete',
			        user: userId?Meteor.users.findOne(userId).Ref():undefined
				});
			} else if (this.previous.deleted && !doc.deleted) {
				History.insert({
			        ref: doc.Ref(),
			        type: 'undelete',
			        user: userId?Meteor.users.findOne(userId).Ref():undefined
				});
			}
		});
	}
};