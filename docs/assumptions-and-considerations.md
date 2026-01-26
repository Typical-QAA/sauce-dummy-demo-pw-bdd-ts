# Test Assumptions and Reasoning

## Purpose of This Document

This document explains how the provided test scenarios were interpreted and implemented, including all assumptions made due to ambiguities or inconsistencies in the original task description.

Before automation work started, the applications were reviewed through documentation analysis and exploratory testing.
Several steps in the task are underspecified, ambiguous, or logically conflicting with real application behavior.

## Web Automation - Assumptions

<https://www.saucedemo.com/>

### Scenario_1

#### Step 2 - "Add all items to the cart"

##### Assumption

As the task does not specify where items should be added from (inventory page of individual item detail page), all items are added directly from the inventory list page after login.

##### Reasoning

- This is the fastest and most common user path.
- The application supports adding all items directly from the list.
- No navigation to item detail pages is required by the scenario.

#### Step 4 - "Find third item and remove it from the cart"

##### Ambiguity

The phrase "third item" is unclear. Possible interpretations:

- third item from the top of the cart,
- third item from the bottom,
- third item in inventory order,
- item with `ID=3`.

##### Assumption

The third item in the cart list (index `nth(2)`) is removed.

##### Reasoning

- Items in the cart are displayed in a deterministic order.
- Index-based selection is clear, reproducible, and testable.
- No product ID-based logic is mentioned in the scenario.

#### Step 5 - "Validate in the Checkout Overview"

##### Observed behavior

- The user cannot directly access Checkout Overview.
- `checkout-step-one.html` requires shipping information first.

##### Additional missing details

- No validation step is defined after item removal.
- No clarity on what exactly must be validated in Overview.

##### Assumptions and implementation approach

1. After item removal (Cart page):

- Validate total items `count = total - 1`
- Validate removed item is not present
- Validate cart badge count is updated

2. Checkout flow:

- Submit required shipping information to reach Checkout Overview

3. Checkout Overview validation:

- Validate items list matches the cart:
  - item names
  - descriptions
  - prices
  - quantities

- Validate total number of items

4. Explicit exclusion:

- Total price validation is intentionally omitted, because it is not required by the task.

#### Step 7 - "Validate that the website confirms the order"

##### Assumption

As no confirmation criteria are defined, order confirmation is validated by:

- presence of the confirmation icon,
- confirmation header text,
- confirmation message text.

##### Reasoning

These elements represent the final success state of the purchase flow.

### Scenario_2

##### Observed application behavior

During exploratory testing with `problem_user`, the following issues were observed:

- product images are incorrect,
- product links may open wrong item pages,
- some items cannot be added to the cart from item detail pages,
- checkout may fail or show a blank page.

These behaviors are known and intentional for this user type.

##### Core issue

The scenario is written as a positive test, but the selected user (`problem_user`) introduces intentional application defects.

It is unclear whether this test is intended to:

- be executed with a different user,
- represent a negative or exploratory test,
- be expected to fail,
- or be excluded from strict pass/fail evaluation.

##### Assumptions and proposal

Suggested refinement is to split into two logical tests:

1. Valid flow with standard_user

2. Original scenario implementation marked as 'Expected to Fail' to account for intentional application defects and environmental limitations

### Scenario_3

#### Step 2 - "Sort products by name"

##### Assumption

As sorting direction is not specified, both sorting options are validated:

- Name (A → Z)
- Name (Z → A)

#### Step 3 - "Validate that items sorted as expected"

##### Assumption

As "expected" sorting is not defined:

- All six inventory items are validated.
- Their visible names are compared against a correctly sorted list according to the selected option.

### Scenario_4

#### Step 2 - "Validate that login failed"

##### Assumption

As failure criteria are not defined, login failure is validated by:

- presence of locked-out error message,
- username and password fields marked as invalid (error-related CSS classes).

## API Automation - Assumptions

<https://dummyjson.com/docs>

### Scenario_1

#### Step 1 - "Get a list of all products"

##### Assumption

`limit=0` query parameter is used.

##### Reasoning

- Default response returns only `30` products.
- `limit=0` returns all available products.

#### Step 2 - "Validate that request was successful"

##### Assumption

Success means:

- HTTP status `200`
- exactly `194` products returned as described in service source code

Source: <https://github.com/Ovi/DummyJSON/blob/master/database/products.json#L11745>

#### Step 3 - "Print titles of products with odd ID numbers"

##### Assumption

- Products are filtered by `id % 2 !== 0`
- Titles are attached to the test report

### Scenario_2

#### Step 2 - "Validate that the creation was successful"

##### Assumption

- HTTP status `201`
- API echoes request data (fake persistence behavior)

#### Step 3 - "Validate response data"

##### Assumption

Response validation includes:

- request fields (`title`, `description`, `price`, `brand`) are echoed,
- new product `id` is generated,
- no follow-up `GET` by ID is executed (fake persistence behavior).

### Scenario_3

#### Step 1 - "Get data for third product"

##### Assumption

"Third product" means product with `ID=3`.

#### Step 2 - "Update third product"

##### Observed behavior

- `PUT` and `PATCH` behave identically.
- API performs partial update over a fixed whitelist.

Source: <https://github.com/Ovi/DummyJSON/blob/master/src/controllers/product.js#L131C1-L155C3>

Update response contains only:

```
id, title, price, discountPercentage, stock, rating,
images, thumbnail, description, brand, category
```

#### Step 3 - "Validate update success"

##### Assumption

- HTTP status `200`
- response contains requested product `id`

#### Step 4 - "Validate response data"

##### Assumption

- update response is treated as authoritative,
- updated fields are validated,
- unchanged fields are validated only if present in response,
- fields not returned by API are explicitly excluded from validation.

### Scenario_4

##### Core conflict

Provided delay values: `[0, 5000, 6000]`

Required response time: `≤ 1000` ms

##### Issues

- `5000` and `6000` cannot satisfy `≤ 1000` ms.
- `6000` exceeds maximum allowed delay (`5000`) and returns HTTP status `400`.

Sources:

- <https://dummyjson.com/docs#intro-delay>
- <https://github.com/Ovi/DummyJSON/blob/master/src/middleware/clean-request.js#L50>

##### Assumptions and proposal

The original scenario mixes positive and negative logic.

Suggested refinement is to split into three logical tests:

1. Valid delay values

- delay ∈ `[0, 5000]`
- HTTP status `200`
- `response time ≤ delay + 1000 ms`

2. Invalid delay values

- delay is not a number value
- delay > `5000`
- HTTP status `400`
- proper error message

3. Original scenario implementation marked as 'Expected to Fail' to account for logical conflicts and impossible performance requirements

## General Observations

- Web app lacks strong validations (checkout form, cart limits).
- Some scenarios assume ideal behavior that does not apply to `problem_user`.
- API is a mock service with:
  - no persistence,
  - limited validation,
  - inconsistent schemas.
- Full schema validation is not reliable.
