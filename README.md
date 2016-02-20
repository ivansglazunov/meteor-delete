# Delete

```
meteor add ivansglazunov:delete
```

Marking a document as a deleted someone.
Required: [ivansglazunov:refs](https://github.com/ivansglazunov/meteor-refs)

## Usage

```js
// On server
var Collection = new Mongo.Collection('collection');
Collection.attachDelete();
// On client user with id "friend"
var id = Collection.insert({});
var document = Collection.findOne(id);
document.delete();
var document = Collection.findOne(id);
console.log(document);
// { _id: '1', _deleted: { user: { id: "friend", collection: "users" }, date: Date } }
var id = Collection.insert({});
var document = Collection.findOne(id);
Collection.delete(document._id);
var document = Collection.findOne(id);
console.log(document);
// { _id: '2', _deleted: { user: { id: "friend", collection: "users" }, date: Date } }
```

### .attachDelete
> Mongo.Collection.prototype.attachDelete(config: Config)

It attaches delete schema and helpers to the collection.

### Config

Everything can be disabled

#### schema
> schema: Boolean = true

Allow to attach SimpleSchema of `_deleted` field.

#### method
> helpers: Boolean = true

Allow `Collection.delete` helper.

#### helper
> helper: Boolean = true

Allow `document.delete` helper.

#### noninsertable
> noninsertable: Boolean = true

It is forbidden to create deleted documents.

#### nonchangable
> nonchangable: Boolean = true

It is forbidden to change deleted documents.

#### nonrecoverable
> nonrecoverable: Boolean = true

It is forbidden to recover deleted documents.

## Versions

### 0.0.5
* Fix autoValue

### 0.0.4
* Fix Schema

### 0.0.3
* server and client

### 0.0.2
* `ivansglazunov:refs@0.1.0`