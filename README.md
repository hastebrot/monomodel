# monomodel

[![Build Status](https://travis-ci.org/hastebrot/monomodel.svg?branch=master)](https://travis-ci.org/hastebrot/monomodel)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Pages

- Demo site is available at https://hastebrot.github.io/monomodel/site/.
- Storybook guide is available at https://hastebrot.github.io/monomodel/guide/.
- Documentation is available at https://hastebrot.github.io/monomodel/apidocs/.

## Development

Run development webserver for site (using [craco](https://github.com/sharegate/craco)) at http://localhost:9010/.

```console
$ yarn site
```

Run development webserver for guide (using [storybook](https://github.com/storybooks/storybook)) at http://localhost:9001/.

```console
$ yarn guide
```

Run development webserver for docs (using [documentation](https://github.com/documentationjs/documentation)) at http://localhost:4001/.

```console
$ yarn docs
```

Run test suites for site (using [jest](https://github.com/facebook/jest)).

```console
$ yarn site:test
```

Release a new version (using [standard-version](https://github.com/conventional-changelog/standard-version/)).

```console
$ yarn release:notes
$ yarn release -r 0.1.0 -m "(release) Version 0.1.0."
```

## Programmer Documentation

- https://reactjs.org/ (A declarative, efficient, and flexible JavaScript library for building user interfaces, [GitHub repository](https://github.com/facebook/react/))
- https://fannypack.style/ (A friendly, themeable, accessible React UI Kit built with Reakit, [GitHub repository](https://github.com/fannypackui/fannypack))
- https://reakit.io/ (Toolkit for building accessible rich web apps with React, [GitHub repository](https://github.com/reakit/reakit))
- https://github.com/ai/storeon (Tiny (173 bytes) event-based immutable state manager for React and Preact)
- https://jestjs.io/ (Delightful JavaScript Testing, [GitHub repository](https://github.com/facebook/jest))
- https://moment.github.io/luxon/ (A powerful, modern, and friendly wrapper for Javascript dates and times, [GitHub repository](https://github.com/moment/luxon))

## PLANFILE

### 27 Apr 2019 / Benjamin

- convential changelogs are nice. let's have them.
  - there is a pull request in the pipeline that allows configuration of conventional commits.
    https://github.com/conventional-changelog/standard-version/pull/323
  - there is a brief overview for the commit message conventions.
    https://github.com/conventional-changelog/standard-version/tree/v5.0.2#commit-message-convention-at-a-glance

### 25 Apr 2019 / Benjamin

- warum hierarchische forms haben, wenn man stattdessen flache haben kann?

  - statt nested fieldsets einfach flat fieldsets
  - und das ergebnis sieht genau gleich aus
  - wobei dann aber form model transformationen und ein form editor wesentlich einfach zu bauern sind

- bei einer nested form enthält `#/` alle fieldsets und fields. bei einer flatten form enthält `#/` lediglich orderNumber und orderDate. totalPrice gehört eigentlich auch noch zu `#/`; hier legen wir ein weiteres fieldset an mit dem `#/` json schema pointer

  - `#/properties/orderItems` is ein fieldset mit header aber ohne body. `#/properties/totalPrice` ist ein fieldset ohne header aber mit body
  - der orangene highlight background ist übrigens getrickst. padding im fieldset header oder body geht nicht; entweder ist der column gutter kaputt oder die fieldsets werden bei jedem verschachteln immer weiter eingerückt. hier benutze ich einfach negatives margin links und rechts. bei einem flat form model muss man sich aber keine gedanken über das layout mit padding machen.
  - interessant sind auch die fieldset arrays, wie `#/properties/orderItems/items`. hier muss ich einen fieldset scope haben, und dann kann man das fieldset einfach nicht mehr weiter hoch schieben. ausschlaggebend ist hier der jsonschema tree.

- man kann dann auch virtual lists und react-movable benutzen
  - ahh, ich brauche dann noch ein manuell definierbares fieldset scope. damit die form dann auch weiß, dass sie array-fremde fieldsets innerhalb des fieldset array repeaten soll
  - wenn alles so eine lose liste ist, dann man man zusätzlich noch die relations definieren; aber im json schema wird zum glück das meiste schon beschrieben
  - lustig ist auch, wenn man die fieldsets editiert hat und dann das json schema editiert. es sollte jetzt leichter sind, da einen diff zu machen und die added/removed fieldsets/fields im editor zu zeigen

---

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

- Rewriting the paths...

---

### 01 Apr 2019 / Benjamin

- Too lazy to type JSON schemas: Added instance type helper functions like `object()`, `array()`, `string()`. Luckily not reserved keywords in JavaScript.
  - A list of instance types can be found in the [JSON Schema Specification](https://tools.ietf.org/html/draft-handrews-json-schema-01#section-4.2.1).
  - [JSONForms](https://github.com/eclipsesource/jsonforms) seems to be more flexible with form layout than [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form), but has not many examples. There is also [JSON Form](https://github.com/jsonform/jsonform) which has a playground with a number examples. These projects are used for inspiration.

---
