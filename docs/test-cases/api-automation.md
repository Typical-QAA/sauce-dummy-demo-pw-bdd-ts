**HTTP API Automation tests to implement**

Documentation is available here: <https://dummyjson.com/docs>

Scenario_1

1. Get a list of all products
2. Validate that request was successful
3. Print titles of products with odd ID numbers to console or to test report

Scenario_2

1. Create a new product with required properties: title, description, price, brand
2. Validate that the creation was successful
3. Validate response data

Scenario_3

1. Get data for third product
2. Update third product
3. Validate that the update was successful
4. Validate that the response data matches the product data from step 1 where applicable

Scenario_4

1. Write a parametrized test for values [0, 5000, 6000]
2. Get a list of products passing ‘delay’ query parameter with the parametrized value
3. Validate that the request was successful
4. Validate that the response time is no longer than `1000` milliseconds
