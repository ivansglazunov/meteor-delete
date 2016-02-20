Mongo.Collection.prototype.attachDelete = function(config) {
	var config = lodash.defaults({
		noninsertable: true,
		nonchangable: true,
		nonrecoverable: true,
		method: true,
		helper: true,
		schema: true
	}, config);
	var collection = this;
	if (config.schema) {
		collection.attachSchema(new SimpleSchema({
			_deleted: {
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
								if (!('_deleted' in collection.findOne(this.docId))) {
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
						if ('_deleted' in doc) return 'notAllowed';
					}
				}
			}
		}));
	}
	if (config.method) {
		collection.delete = function(_id) {
			collection.update(_id, { $set: { '_deleted.date': new Date() } });
		};
	}
	if (config.helper) {
		collection.helpers({
			delete: function() {
				collection.update(this._id, { $set: { '_deleted.date': new Date() } })
			}
		});
	}
	if (config.noninsertable) {
		collection.deny({
			insert: function(userId, doc) {
				if ('_deleted' in doc)
					throw new Meteor.Error('Deleted document is noninsertable');
			}
		});
	}
	if (config.nonchangable) {
		collection.deny({
			update: function(userId, doc, fields, modifier) {
				if ('_deleted' in doc && fields.length > 1 && fields[0] != '_deleted')
					throw new Meteor.Error('Deleted document is nonchangable');
			}
		});
	}
	if (config.nonrecoverable) {
		collection.deny({
			update: function(userId, doc, fields, modifier) {
				if ('_deleted' in doc && lodash.includes(fields, '_deleted'))
					throw new Meteor.Error('Deleted document is nonrecoverable');
			}
		});
	}
};