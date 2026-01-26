**Web Automation tests to implement**

Test website is: <https://www.saucedemo.com/>

Scenario_1

1. Log in as a `standard user`
2. Add all item to the cart
3. Go to the cart
4. Find third item and remove it from the cart
5. Validate in the Checkout Overview that it only contains the items that you want to purchase, as well as the total count of items
6. Finish the purchase
7. Validate that the website confirms the order

Scenario_2

1. Log in as a `problem_user`
2. Find one item by name, click on the item
3. Add it to the cart from item page
4. Go to the cart
5. Validate that item was added

Scenario_3:

1. Log in as a `standard user`
2. Sort products by name
3. Validate that items sorted as expected

Scenario_4:

1. Log in as a `locked_out_user`
2. Validate that login failed
