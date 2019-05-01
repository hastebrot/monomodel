# forms with fieldsets and fields based on json schema

this is about json schemas, json documents, form meta-models, and form models.

## just warming up

a json schema document...

```js
const schema = object({
  properties: {
    orderNumber: string(),
    customer: object({
      properties: {
        customerNumber: string(),
      },
    }),
    orderItems: array({
      items: object({
        properties: {
          productNumber: string(),
          quantity: integer(),
        },
      }),
    }),
  },
})
```

...for a json document.

```js
const document = {
  orderNumber: "1234AA",
  customer: {
    customerNumber: "C124",
  },
  orderItems: [
    { productNumber: "B00ABA0ZOA", quantity: 1 },
    { productNumber: "9780099477464", quantity: 1 },
  ],
}
```

json pointers for json document.

```js
"#/orderNumber"
"#/customer/customerNumber"
"#/orderItems/0/productNumber"
"#/orderItems/1/productNumber"
```

json pointers for json schema document.

```js
"#/properties/orderNumber"
"#/properties/customer/properties/customerNumber"
"#/properties/orderItems/items/properties/productNumber"
```

array of path segments.

```js
;[
  ["#", "properties", "orderNumber"],
  ["#", "properties", "customer", "properties", "customerNumber"],
  ["#", "properties", "orderItems", "items", "properties", "productNumber"],
]
```

arrays of path segments of parent and child schemas.

```js
;[
  {
    parentPath: ["#"],
    childPath: ["properties", "orderNumber"],
  },
  {
    parentPath: ["#", "properties", "customer"],
    childPath: ["properties", "customerNumber"],
  },
  {
    parentPath: ["#", "properties", "orderItems", "items"],
    childPath: ["properties", "productNumber"],
  },
]
```

## build a form meta-model

```js
const schema = object({
  properties: {
    orderNumber: string(),
    customer: object({
      properties: {
        customerNumber: string(),
      },
    }),
    orderItems: array({
      items: object({
        properties: {
          productNumber: string(),
          quantity: integer(),
        },
      }),
    }),
  },
})
```

```js
const metaModel = fieldset("array", {
  children: [
    fieldset("object", {
      pointer: "#/",
      children: [
        field("string", {
          pointer: "#/properties/orderNumber",
        }),
      ],
    }),
    fieldset("object", {
      pointer: "#/properties/customer",
      children: [
        field("string", {
          pointer: "#/properties/customer/customerNumber",
        }),
      ],
    }),
    fieldset("array", {
      pointer: "#/properties/orderItems",
    }),
    fieldset("object", {
      pointer: "#/properties/orderItems/items",
      children: [
        field("string", {
          pointer: "#/properties/orderItems/items/properties/productNumber",
        }),
        field("integer", {
          pointer: "#/properties/orderItems/items/properties/quantity",
        }),
      ],
    }),
  ],
})
```

## build a form model

## appendix: build schema helpers

```js
export const object = payload => schema("object", payload)
export const array = payload => schema("array", payload)
export const boolean = payload => schema("boolean", payload)
export const string = payload => schema("string", payload)
export const number = payload => schema("number", payload)
export const integer = payload => schema("integer", payload)
export const schema = (type, payload) => ({ type, ...payload })
```

## appendix: specifications

specifications.

- A [JSON Pointer](https://tools.ietf.org/html/rfc6901) is a string used to identify a specific value within a JSON document. The specification is from April 2013.
- A [JSON Schema](https://json-schema.org/specification.html) is a vocabulary to annotate and validate JSON documents. The current specifications are `draft-07` (`draft-handrews-...-01`) from January and March 2018.

json schema specifications.

- [JSON Schema Core](https://tools.ietf.org/html/draft-handrews-json-schema-01) defines the basic foundation of JSON Schema.
- [JSON Schema Validation](https://tools.ietf.org/html/draft-handrews-json-schema-validation-01) defines the validation keywords of JSON Schema.
- [JSON Hyper-Schema](https://tools.ietf.org/html/draft-handrews-json-schema-hyperschema-01) defines the hyper-media keywords of JSON Schema.
- [Relative JSON Pointers](https://tools.ietf.org/html/draft-handrews-relative-json-pointer-01) extends the JSON pointer syntax for relative pointers.

other json specifications.

- [JSON-LD](https://www.w3.org/TR/json-ld/) serialization for linked data.
- [JSON Patch](https://tools.ietf.org/html/rfc6902) defines a document structure for expressing a sequence of operations to apply to a JSON document.

## appendix: source repositories

- **graphlib:** A directed multi-graph library for JavaScript ([GitHub project](https://github.com/dagrejs/graphlib)).
- **json-ptr:** A complete implementation of JSON Pointer (RFC 6901) for nodejs and modern browsers ([GitHub project](https://github.com/flitbit/json-ptr)).
- **json-schema-walker:** A system that visits all schema objects in a JSON Schema document ([GitHub project](https://github.com/cloudflare/json-schema-tools/tree/master/workspaces/json-schema-walker)).
- **json-schema-ref-parser:** Parse, Resolve, and Dereference JSON Schema \$ref pointers in Node and browsers ([GitHub project](https://github.com/APIDevTools/json-schema-ref-parser)).
- **ajv:** The fastest JSON Schema validator for Node.js and browser ([GitHub project](https://github.com/epoberezkin/ajv)).
