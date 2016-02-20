Mongo.Collection.prototype.attachDelete = function(config) {
	var config = lodash.defaults(config, {
		noninsertable: true,
		nonchangable: true,
		nonrecoverable: true,
		method: true,
		helper: true,
		schema: true,
		field: '_deleted',
		hidden: true
	});
	var collection = this;
	if (config.schema) {
		var schema = {};
		schema[config.field] = {
			type: new SimpleSchema({
				user: {
					type: Refs.Schema,
					optional: true,
					autoValue: function() {
						if (this.isUpdate) {
							if (this.userId) return Meteor.users.findOne(this.userId).Ref();
						}
					},
					custom: function() {
						if (this.isUpdate) {
							if (this.userId) return Meteor.users.findOne(this.userId).Ref();
						}
					}
				},
				date: {
					type: Date,
					optional: true,
					autoValue: function() {
						if (this.isUpdate) {
							if (!(config.field in collection.findOne(this.docId))) {
								return new Date();
							}
						}
					}
				}
			}),
			optional: true,
			custom: function() {
				if (this.isInsert && this.isSet) return 'notAllowed';
				else if (this.isUpdate) {
					var doc = collection.findOne(this.docId);
					if (config.field in doc) return 'notAllowed';
				}
			}
		};
		collection.attachSchema(new SimpleSchema(schema));
	}
	if (config.method) {
		collection.delete = function(_id) {
			var $set = {};
			$set[config.field+'.date'] = new Date();
			collection.update(_id, { $set:$set });
		};
	}
	if (config.helper) {
		collection.helpers({
			delete: function() {
				var $set = {};
				$set[config.field+'.date'] = new Date();
				collection.update(this._id, { $set:$set });
			}
		});
	}
	if (config.noninsertable) {
		collection.deny({
			insert: function(userId, doc) {
				if (config.field in doc)
					throw new Meteor.Error('Deleted document is noninsertable');
			}
		});
	}
	if (config.nonchangable) {
		collection.deny({
			update: function(userId, doc, fields, modifier) {
				if (config.field in doc && fields.length > 1 && fields[0] != config.field)
					throw new Meteor.Error('Deleted document is nonchangable');
			}
		});
	}
	if (config.nonrecoverable) {
		collection.deny({
			update: function(userId, doc, fields, modifier) {
				if (config.field in doc && lodash.includes(fields, config.field))
					throw new Meteor.Error('Deleted document is nonrecoverable');
			}
		});
	}
	if (config.hidden) {
		if (Meteor.isServer) {
			var before = function (userId, selector, options) {
				if (!('_deleted' in selector)) {
					selector['_deleted'] = { $exists: false };
				}
			};
			collection.before.find(before);
			collection.before.findOne(before);
		}
	}
};