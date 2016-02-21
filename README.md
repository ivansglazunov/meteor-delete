# Delete

```
meteor add ivansglazunov:delete
```

Adds a field `_deleted`. Info about the user and time on `delete` or `undelete` stored in the [ivansglazunov:history](https://github.com/ivansglazunov/meteor-history).

## Usage

```js
// On server
var Collection = new Mongo.Collection('collection');
Collection.attachDelete({
    hidden: false
});
// On client user with id "friend"
var id = Collection.insert({});
var document = Collection.findOne(id);
document.delete();
var document = Collection.findOne(id);
console.log(document);
// { _id: '1', _deleted: true, date: Date } }
var id = Collection.insert({});
var document = Collection.findOne(id);
Collection.delete(document._id);
var document = Collection.findOne(id);
console.log(document);
// { _id: '2', _deleted: true, date: Date } }
```

### .attachDelete
> Mongo.Collection.prototype.attachDelete(config: Config)

It attaches delete schema and helpers to the collection.

### Config

Everything can be disabled

#### history
> history: Boolean = true

Insert document about `delete` and `undelete` type in `ivansglazunov:history` collection.

#### hidden
> hidden: Boolean = true

Adds to any find query: `{ _deleted: { $exist: false } }` if _deleted field is not defined in query.

#### field
> field: String = '_deleted'

Custom field name.

#### schema
> schema: Boolean = true

Allow to attach SimpleSchema of `_deleted` field.

#### collectionHelpers
> collectionHelpers: Boolean = true

Add `Collection.delete` and `Collection.undelete` functions.

#### documentHelpers
> documentHelpers: Boolean = true

Add `document.delete` and `document.undelete` helper.

#### undelete
> undelete: Boolean = true

It is forbidden to recover deleted documents.

## Versions

### 0.2.0
* New logic based on Meteor.methods
* Manually change the field is forbidden!

### 0.1.0
* Move user and data info from document into history
* Shorter config

### 0.0.3
* Auto hidden deleted documents from results

### 0.0.2
* Custom field name