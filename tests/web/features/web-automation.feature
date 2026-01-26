@web @docs
Feature: Web Automation


  Scenario: Scenario_2 - Add random item to cart and verify details
    Given I am logged as "<user_key>" user on inventory page
    When I open a random item page from inventory page
    Then the item details on item page should match the inventory data
    When I add the item from item page to the cart and open the cart page
    Then the cart should contain the selected 1 item and have a proper badge count

    @expected_to_pass
    Examples: Successful purchase flow
      | user_key |
      | STANDARD |

    @fail @expected_to_fail
    Examples: Known issues with problematic accounts
      | user_key |
      | PROBLEM  |


  @expected_to_pass
  Scenario: Scenario_3 - Can sort items by name on inventory page
    Given I am logged as "STANDARD" user on inventory page
    When I click sorting and select "<sort_type>" on inventory page
    Then I see items sorted by their names in "<sort_type>" order on inventory page
    Examples:
    | sort_type      |
    | Name (Z to A)  |
    | Name (A to Z)  |


  @expected_to_pass
  Scenario: Scenario_4 - Locked out user receives error message
    Given I am on the login page
    When I attempt to log in as "LOCKED_OUT"
    Then I should see a login error message "LOGIN_LOCKED"
    And the login inputs should be highlighted with the error class


  @expected_to_pass
  Scenario: Scenario_1 - Full checkout flow after removing an item from the cart
    Given I am logged as "STANDARD" user on inventory page
    When I add all 6 items from the inventory page to the cart
    And I open the cart page
    Then the cart should contain all 6 inventory items
    When I remove the item at index 2 from the cart
    Then the cart should be updated with the remaining 5 items
    When I proceed to checkout, enter shipping information and proceed to checkout overview
    Then the checkout overview should show the correct items
    When I finish the checkout
    Then I should see the order confirmation "SUCCESS"
