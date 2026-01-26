@api
Feature: Products API


  @docs
  Scenario: Scenario_1 - Retrieve all products with filtered fields
    When I send a GET request to "/products" with params "limit" 0 and "select" "id,title"
    Then the response status should be 200
    And the total number of products in response should be 194
    And I extract from response and attach titles of products with odd IDs to the test report


  @docs
  Scenario: Scenario_2 - Create a new product
    When I send a POST request to "/products/add" with a new valid minimal product payload
    Then the response status should be 201
    And the created product should match the payload with a generated ID


  @docs
  Scenario: Scenario_3 - Retrieve and partially update a product
    Given an existing product with ID 3
    When I send a PATCH request to update product with ID 3 with a partial payload
    Then the response status should be 200
    And the updated product should preserve unchanged fields


  @docs
  Scenario Outline: Scenario_4 - Fixed response time validation
    When I send a GET request to "/products" with delay <delay>
    Then the response status should be 200
    And the response time should be less than or equal to 1000 ms

    @expected_to_pass
    Examples: Successful purchase flow
      | delay |
      | 0 |

    @fail @expected_to_fail
    Examples: Known issues with problematic accounts
      | delay |
      | 5000  |
      | 6000  |


  @no_docs
  Scenario Outline: Scenario_4 - Dynamic response time validation
    When I send a GET request to "/products" with delay <delay>
    Then the response status should be 200
    And the response time should meet the dynamic threshold for delay <delay> plus 1000 ms

    Examples:
      | delay |
      | 0     |
      | 200   |
      | 3000  |
      | 5000  |


  @not_docs @fast
  Scenario Outline: Scenario_4 - Invalid delay boundaries
    When I send a GET request to "/products" with invalid delay "<delay>"
    Then the response status should be 400
    And the error message "<errorKey>" should be correct for delay "<delay>"

    Examples:
      | delay | errorKey           |
      | delay | DELAY_NOT_NUMBER   |
      | -1    | DELAY_BELOW_MIN    |
      | 5001  | DELAY_OVER_MAX     |
