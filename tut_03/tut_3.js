var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
function merge(first, second, mergeFunction) {
    if (mergeFunction === void 0) { mergeFunction = function (item) { return item; }; }
    var merged = __assign(__assign({}, first), second);
    return mergeFunction(merged);
}
function addIsActive(item) {
    return __assign(__assign({}, item), { isActive: true });
}
var person = { name: "Alice", hobbies: ["Reading", "Gaming"] };
var details = { employed: true, profession: "Engineer" };
var mergedResult = merge(person, details, addIsActive);
console.log(mergedResult);
var uniqueID = Symbol('uniqueID');
var obj1 = (_a = {
        "foo": "bar"
    },
    _a[Symbol.iterator] = "qux",
    _a.uniqueID = "1234",
    _a);
obj1.foo;
obj1.uniqueID;
obj1[Symbol.iterator];
console.log(obj1.uniqueID);
