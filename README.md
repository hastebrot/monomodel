# monomodel

## Pages

A storybook guide is available at https://hastebrot.github.io/monomodel/guide/.

## Development

Run development webserver for site.

```console
$ yarn site
```

Run development webserver for guide.

```console
$ yarn guide
```

Run test suites for site.

```console
$ yarn site:test
```

## PLANFILE

### 12 Apr 2019 / Benjamin

- Started with form editor. `FormPart` is very usedful for drag and drop functionality.
  - Introduced `DragBox` and `DropBox` for better readability.

---

### 02 Apr 2019 / Benjamin

- Using `schemaWalk(schema, visitFn)` from [json-schema-tools](https://github.com/cloudflare/json-schema-tools/tree/%40cloudflare/json-schema-walker%400.1.1/workspaces/json-schema-walker). The `visitFn` callback gives me `schemaObject`, `path`, `parentSchemaObject` and `parentPath`.
  - **It works for the initial simple examples of nested JSON schemas!** :sunglasses:
  - Using a path `registry` to keep track of `children` indices for the `model`. Every node (except leaves) in the `model` has a `children` array.
  - `path` and `parentPath` are JSON pointer fragments which are arrays. To generate `registry` path keys `toPointer()` was introduced which returns a pointer string.
  - Using lodash's `set()` to add `fieldset()`s and `field()`s to the `model`. It automatically generates the intermediate objects and arrays according to the object path. Introduced `toObjectPath()` which returns a JavaScript object path string.

- Rewriting the paths

---

### 01 Apr 2019 / Benjamin

- Too lazy to type JSON schemas: Added instance type helper functions like `object()`, `array()`, `string()`. Luckily not reserved keywords in JavaScript.
  - A list of instance types can be found in the [JSON Schema Specification](https://tools.ietf.org/html/draft-handrews-json-schema-01#section-4.2.1).
  - [JSONForms](https://github.com/eclipsesource/jsonforms) seems to be more flexible with form layout than [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form), but has not many examples. There is also [JSON Form](https://github.com/jsonform/jsonform) which has a playground with a number examples. These projects are used for inspiration.

---
