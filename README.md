# monomodel

## development

webserver for site.

```console
$ yarn site:start
```

webserver for guide.

```console
$ yarn guide:start
```

## planfile

### 01 apr 2019 / benjamin

- Too lazy to type JSON schemas: Added instance type helper functions like `object()`, `array()`, `string()`. Luckily no reserved keywords in JavaScript.
  - A list of instance types can be found in the [JSON Schema Specification](https://tools.ietf.org/html/draft-handrews-json-schema-01#section-4.2.1).

- [JSONForms](https://github.com/eclipsesource/jsonforms) seems to be more flexible than [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form).

---
