//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var EJSON = Package.ejson.EJSON;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var ReactiveDict;

var require = meteorInstall({"node_modules":{"meteor":{"reactive-dict":{"reactive-dict.js":["babel-runtime/helpers/typeof",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/reactive-dict/reactive-dict.js                                                                        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _typeof;module.import('babel-runtime/helpers/typeof',{"default":function(v){_typeof=v}});                     //
// XXX come up with a serialization method which canonicalizes object key                                         // 1
// order, which would allow us to use objects as values for equals.                                               // 2
var stringify = function stringify(value) {                                                                       // 3
  if (value === undefined) return 'undefined';                                                                    // 4
  return EJSON.stringify(value);                                                                                  // 6
};                                                                                                                // 7
var parse = function parse(serialized) {                                                                          // 8
  if (serialized === undefined || serialized === 'undefined') return undefined;                                   // 9
  return EJSON.parse(serialized);                                                                                 // 11
};                                                                                                                // 12
                                                                                                                  //
var changed = function changed(v) {                                                                               // 14
  v && v.changed();                                                                                               // 15
};                                                                                                                // 16
                                                                                                                  //
// XXX COMPAT WITH 0.9.1 : accept migrationData instead of dictName                                               // 18
ReactiveDict = function (_ReactiveDict) {                                                                         // 19
  function ReactiveDict(_x) {                                                                                     // 19
    return _ReactiveDict.apply(this, arguments);                                                                  // 19
  }                                                                                                               // 19
                                                                                                                  //
  ReactiveDict.toString = function () {                                                                           // 19
    return _ReactiveDict.toString();                                                                              // 19
  };                                                                                                              // 19
                                                                                                                  //
  return ReactiveDict;                                                                                            // 19
}(function (dictName) {                                                                                           // 19
  // this.keys: key -> value                                                                                      // 20
  if (dictName) {                                                                                                 // 21
    if (typeof dictName === 'string') {                                                                           // 22
      // the normal case, argument is a string name.                                                              // 23
      // _registerDictForMigrate will throw an error on duplicate name.                                           // 24
      ReactiveDict._registerDictForMigrate(dictName, this);                                                       // 25
      this.keys = ReactiveDict._loadMigratedDict(dictName) || {};                                                 // 26
      this.name = dictName;                                                                                       // 27
    } else if ((typeof dictName === 'undefined' ? 'undefined' : _typeof(dictName)) === 'object') {                // 28
      // back-compat case: dictName is actually migrationData                                                     // 29
      this.keys = dictName;                                                                                       // 30
    } else {                                                                                                      // 31
      throw new Error("Invalid ReactiveDict argument: " + dictName);                                              // 32
    }                                                                                                             // 33
  } else {                                                                                                        // 34
    // no name given; no migration will be performed                                                              // 35
    this.keys = {};                                                                                               // 36
  }                                                                                                               // 37
                                                                                                                  //
  this.allDeps = new Tracker.Dependency();                                                                        // 39
  this.keyDeps = {}; // key -> Dependency                                                                         // 40
  this.keyValueDeps = {}; // key -> Dependency                                                                    // 41
});                                                                                                               // 42
                                                                                                                  //
_.extend(ReactiveDict.prototype, {                                                                                // 44
  // set() began as a key/value method, but we are now overloading it                                             // 45
  // to take an object of key/value pairs, similar to backbone                                                    // 46
  // http://backbonejs.org/#Model-set                                                                             // 47
                                                                                                                  //
  set: function () {                                                                                              // 49
    function set(keyOrObject, value) {                                                                            // 49
      var self = this;                                                                                            // 50
                                                                                                                  //
      if ((typeof keyOrObject === 'undefined' ? 'undefined' : _typeof(keyOrObject)) === 'object' && value === undefined) {
        // Called as `dict.set({...})`                                                                            // 53
        self._setObject(keyOrObject);                                                                             // 54
        return;                                                                                                   // 55
      }                                                                                                           // 56
      // the input isn't an object, so it must be a key                                                           // 57
      // and we resume with the rest of the function                                                              // 58
      var key = keyOrObject;                                                                                      // 59
                                                                                                                  //
      value = stringify(value);                                                                                   // 61
                                                                                                                  //
      var keyExisted = _.has(self.keys, key);                                                                     // 63
      var oldSerializedValue = keyExisted ? self.keys[key] : 'undefined';                                         // 64
      var isNewValue = value !== oldSerializedValue;                                                              // 65
                                                                                                                  //
      self.keys[key] = value;                                                                                     // 67
                                                                                                                  //
      if (isNewValue || !keyExisted) {                                                                            // 69
        self.allDeps.changed();                                                                                   // 70
      }                                                                                                           // 71
                                                                                                                  //
      if (isNewValue) {                                                                                           // 73
        changed(self.keyDeps[key]);                                                                               // 74
        if (self.keyValueDeps[key]) {                                                                             // 75
          changed(self.keyValueDeps[key][oldSerializedValue]);                                                    // 76
          changed(self.keyValueDeps[key][value]);                                                                 // 77
        }                                                                                                         // 78
      }                                                                                                           // 79
    }                                                                                                             // 80
                                                                                                                  //
    return set;                                                                                                   // 49
  }(),                                                                                                            // 49
                                                                                                                  //
  setDefault: function () {                                                                                       // 82
    function setDefault(keyOrObject, value) {                                                                     // 82
      var self = this;                                                                                            // 83
                                                                                                                  //
      if ((typeof keyOrObject === 'undefined' ? 'undefined' : _typeof(keyOrObject)) === 'object' && value === undefined) {
        // Called as `dict.setDefault({...})`                                                                     // 86
        self._setDefaultObject(keyOrObject);                                                                      // 87
        return;                                                                                                   // 88
      }                                                                                                           // 89
      // the input isn't an object, so it must be a key                                                           // 90
      // and we resume with the rest of the function                                                              // 91
      var key = keyOrObject;                                                                                      // 92
                                                                                                                  //
      if (!_.has(self.keys, key)) {                                                                               // 94
        self.set(key, value);                                                                                     // 95
      }                                                                                                           // 96
    }                                                                                                             // 97
                                                                                                                  //
    return setDefault;                                                                                            // 82
  }(),                                                                                                            // 82
                                                                                                                  //
  get: function () {                                                                                              // 99
    function get(key) {                                                                                           // 99
      var self = this;                                                                                            // 100
      self._ensureKey(key);                                                                                       // 101
      self.keyDeps[key].depend();                                                                                 // 102
      return parse(self.keys[key]);                                                                               // 103
    }                                                                                                             // 104
                                                                                                                  //
    return get;                                                                                                   // 99
  }(),                                                                                                            // 99
                                                                                                                  //
  equals: function () {                                                                                           // 106
    function equals(key, value) {                                                                                 // 106
      var self = this;                                                                                            // 107
                                                                                                                  //
      // Mongo.ObjectID is in the 'mongo' package                                                                 // 109
      var ObjectID = null;                                                                                        // 110
      if (Package.mongo) {                                                                                        // 111
        ObjectID = Package.mongo.Mongo.ObjectID;                                                                  // 112
      }                                                                                                           // 113
                                                                                                                  //
      // We don't allow objects (or arrays that might include objects) for                                        // 115
      // .equals, because JSON.stringify doesn't canonicalize object key                                          // 116
      // order. (We can make equals have the right return value by parsing the                                    // 117
      // current value and using EJSON.equals, but we won't have a canonical                                      // 118
      // element of keyValueDeps[key] to store the dependency.) You can still use                                 // 119
      // "EJSON.equals(reactiveDict.get(key), value)".                                                            // 120
      //                                                                                                          // 121
      // XXX we could allow arrays as long as we recursively check that there                                     // 122
      // are no objects                                                                                           // 123
      if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean' && typeof value !== 'undefined' && !(value instanceof Date) && !(ObjectID && value instanceof ObjectID) && value !== null) {
        throw new Error("ReactiveDict.equals: value must be scalar");                                             // 131
      }                                                                                                           // 132
      var serializedValue = stringify(value);                                                                     // 133
                                                                                                                  //
      if (Tracker.active) {                                                                                       // 135
        self._ensureKey(key);                                                                                     // 136
                                                                                                                  //
        if (!_.has(self.keyValueDeps[key], serializedValue)) self.keyValueDeps[key][serializedValue] = new Tracker.Dependency();
                                                                                                                  //
        var isNew = self.keyValueDeps[key][serializedValue].depend();                                             // 141
        if (isNew) {                                                                                              // 142
          Tracker.onInvalidate(function () {                                                                      // 143
            // clean up [key][serializedValue] if it's now empty, so we don't                                     // 144
            // use O(n) memory for n = values seen ever                                                           // 145
            if (!self.keyValueDeps[key][serializedValue].hasDependents()) delete self.keyValueDeps[key][serializedValue];
          });                                                                                                     // 148
        }                                                                                                         // 149
      }                                                                                                           // 150
                                                                                                                  //
      var oldValue = undefined;                                                                                   // 152
      if (_.has(self.keys, key)) oldValue = parse(self.keys[key]);                                                // 153
      return EJSON.equals(oldValue, value);                                                                       // 154
    }                                                                                                             // 155
                                                                                                                  //
    return equals;                                                                                                // 106
  }(),                                                                                                            // 106
                                                                                                                  //
  all: function () {                                                                                              // 157
    function all() {                                                                                              // 157
      this.allDeps.depend();                                                                                      // 158
      var ret = {};                                                                                               // 159
      _.each(this.keys, function (value, key) {                                                                   // 160
        ret[key] = parse(value);                                                                                  // 161
      });                                                                                                         // 162
      return ret;                                                                                                 // 163
    }                                                                                                             // 164
                                                                                                                  //
    return all;                                                                                                   // 157
  }(),                                                                                                            // 157
                                                                                                                  //
  clear: function () {                                                                                            // 166
    function clear() {                                                                                            // 166
      var self = this;                                                                                            // 167
                                                                                                                  //
      var oldKeys = self.keys;                                                                                    // 169
      self.keys = {};                                                                                             // 170
                                                                                                                  //
      self.allDeps.changed();                                                                                     // 172
                                                                                                                  //
      _.each(oldKeys, function (value, key) {                                                                     // 174
        changed(self.keyDeps[key]);                                                                               // 175
        if (self.keyValueDeps[key]) {                                                                             // 176
          changed(self.keyValueDeps[key][value]);                                                                 // 177
          changed(self.keyValueDeps[key]['undefined']);                                                           // 178
        }                                                                                                         // 179
      });                                                                                                         // 180
    }                                                                                                             // 182
                                                                                                                  //
    return clear;                                                                                                 // 166
  }(),                                                                                                            // 166
                                                                                                                  //
  'delete': function () {                                                                                         // 184
    function _delete(key) {                                                                                       // 184
      var self = this;                                                                                            // 185
      var didRemove = false;                                                                                      // 186
                                                                                                                  //
      if (_.has(self.keys, key)) {                                                                                // 188
        var oldValue = self.keys[key];                                                                            // 189
        delete self.keys[key];                                                                                    // 190
        changed(self.keyDeps[key]);                                                                               // 191
        if (self.keyValueDeps[key]) {                                                                             // 192
          changed(self.keyValueDeps[key][oldValue]);                                                              // 193
          changed(self.keyValueDeps[key]['undefined']);                                                           // 194
        }                                                                                                         // 195
        self.allDeps.changed();                                                                                   // 196
        didRemove = true;                                                                                         // 197
      }                                                                                                           // 198
                                                                                                                  //
      return didRemove;                                                                                           // 200
    }                                                                                                             // 201
                                                                                                                  //
    return _delete;                                                                                               // 184
  }(),                                                                                                            // 184
                                                                                                                  //
  _setObject: function () {                                                                                       // 203
    function _setObject(object) {                                                                                 // 203
      var self = this;                                                                                            // 204
                                                                                                                  //
      _.each(object, function (value, key) {                                                                      // 206
        self.set(key, value);                                                                                     // 207
      });                                                                                                         // 208
    }                                                                                                             // 209
                                                                                                                  //
    return _setObject;                                                                                            // 203
  }(),                                                                                                            // 203
                                                                                                                  //
  _setDefaultObject: function () {                                                                                // 211
    function _setDefaultObject(object) {                                                                          // 211
      var self = this;                                                                                            // 212
                                                                                                                  //
      _.each(object, function (value, key) {                                                                      // 214
        self.setDefault(key, value);                                                                              // 215
      });                                                                                                         // 216
    }                                                                                                             // 217
                                                                                                                  //
    return _setDefaultObject;                                                                                     // 211
  }(),                                                                                                            // 211
                                                                                                                  //
  _ensureKey: function () {                                                                                       // 219
    function _ensureKey(key) {                                                                                    // 219
      var self = this;                                                                                            // 220
      if (!(key in self.keyDeps)) {                                                                               // 221
        self.keyDeps[key] = new Tracker.Dependency();                                                             // 222
        self.keyValueDeps[key] = {};                                                                              // 223
      }                                                                                                           // 224
    }                                                                                                             // 225
                                                                                                                  //
    return _ensureKey;                                                                                            // 219
  }(),                                                                                                            // 219
                                                                                                                  //
  // Get a JSON value that can be passed to the constructor to                                                    // 227
  // create a new ReactiveDict with the same contents as this one                                                 // 228
  _getMigrationData: function () {                                                                                // 229
    function _getMigrationData() {                                                                                // 229
      // XXX sanitize and make sure it's JSONible?                                                                // 230
      return this.keys;                                                                                           // 231
    }                                                                                                             // 232
                                                                                                                  //
    return _getMigrationData;                                                                                     // 229
  }()                                                                                                             // 229
});                                                                                                               // 44
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"migration.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/reactive-dict/migration.js                                                                            //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
ReactiveDict._migratedDictData = {}; // name -> data                                                              // 1
ReactiveDict._dictsToMigrate = {}; // name -> ReactiveDict                                                        // 2
                                                                                                                  //
ReactiveDict._loadMigratedDict = function (dictName) {                                                            // 4
  if (_.has(ReactiveDict._migratedDictData, dictName)) return ReactiveDict._migratedDictData[dictName];           // 5
                                                                                                                  //
  return null;                                                                                                    // 8
};                                                                                                                // 9
                                                                                                                  //
ReactiveDict._registerDictForMigrate = function (dictName, dict) {                                                // 11
  if (_.has(ReactiveDict._dictsToMigrate, dictName)) throw new Error("Duplicate ReactiveDict name: " + dictName);
                                                                                                                  //
  ReactiveDict._dictsToMigrate[dictName] = dict;                                                                  // 15
};                                                                                                                // 16
                                                                                                                  //
if (Meteor.isClient && Package.reload) {                                                                          // 18
  // Put old migrated data into ReactiveDict._migratedDictData,                                                   // 19
  // where it can be accessed by ReactiveDict._loadMigratedDict.                                                  // 20
  var migrationData = Package.reload.Reload._migrationData('reactive-dict');                                      // 21
  if (migrationData && migrationData.dicts) ReactiveDict._migratedDictData = migrationData.dicts;                 // 22
                                                                                                                  //
  // On migration, assemble the data from all the dicts that have been                                            // 25
  // registered.                                                                                                  // 26
  Package.reload.Reload._onMigrate('reactive-dict', function () {                                                 // 27
    var dictsToMigrate = ReactiveDict._dictsToMigrate;                                                            // 28
    var dataToMigrate = {};                                                                                       // 29
                                                                                                                  //
    for (var dictName in meteorBabelHelpers.sanitizeForInObject(dictsToMigrate)) {                                // 31
      dataToMigrate[dictName] = dictsToMigrate[dictName]._getMigrationData();                                     // 32
    }return [true, { dicts: dataToMigrate }];                                                                     // 31
  });                                                                                                             // 35
}                                                                                                                 // 36
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/reactive-dict/reactive-dict.js");
require("./node_modules/meteor/reactive-dict/migration.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['reactive-dict'] = {}, {
  ReactiveDict: ReactiveDict
});

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var Session;

(function(){

/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
// packages/session/session.js                                                 //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////
                                                                               //
Session = new ReactiveDict('session');                                         // 1
                                                                               // 2
// Documentation here is really awkward because the methods are defined        // 3
// elsewhere                                                                   // 4
                                                                               // 5
/**                                                                            // 6
 * @memberOf Session                                                           // 7
 * @method set                                                                 // 8
 * @summary Set a variable in the session. Notify any listeners that the value
 * has changed (eg: redraw templates, and rerun any                            // 10
 * [`Tracker.autorun`](#tracker_autorun) computations, that called             // 11
 * [`Session.get`](#session_get) on this `key`.)                               // 12
 * @locus Client                                                               // 13
 * @param {String} key The key to set, eg, `selectedItem`                      // 14
 * @param {EJSONable | undefined} value The new value for `key`                // 15
 */                                                                            // 16
                                                                               // 17
/**                                                                            // 18
 * @memberOf Session                                                           // 19
 * @method setDefault                                                          // 20
 * @summary Set a variable in the session if it hasn't been set before.        // 21
 * Otherwise works exactly the same as [`Session.set`](#session_set).          // 22
 * @locus Client                                                               // 23
 * @param {String} key The key to set, eg, `selectedItem`                      // 24
 * @param {EJSONable | undefined} value The new value for `key`                // 25
 */                                                                            // 26
                                                                               // 27
/**                                                                            // 28
 * @memberOf Session                                                           // 29
 * @method get                                                                 // 30
 * @summary Get the value of a session variable. If inside a [reactive         // 31
 * computation](#reactivity), invalidate the computation the next time the     // 32
 * value of the variable is changed by [`Session.set`](#session_set). This     // 33
 * returns a clone of the session value, so if it's an object or an array,     // 34
 * mutating the returned value has no effect on the value stored in the        // 35
 * session.                                                                    // 36
 * @locus Client                                                               // 37
 * @param {String} key The name of the session variable to return              // 38
 */                                                                            // 39
                                                                               // 40
/**                                                                            // 41
 * @memberOf Session                                                           // 42
 * @method equals                                                              // 43
 * @summary Test if a session variable is equal to a value. If inside a        // 44
 * [reactive computation](#reactivity), invalidate the computation the next    // 45
 * time the variable changes to or from the value.                             // 46
 * @locus Client                                                               // 47
 * @param {String} key The name of the session variable to test                // 48
 * @param {String | Number | Boolean | null | undefined} value The value to    // 49
 * test against                                                                // 50
 */                                                                            // 51
                                                                               // 52
/////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.session = {}, {
  Session: Session
});

})();
/* Imports for global scope */

Session = Package.session.Session;

