use std::collections::HashMap;
use candid::{CandidType, Principal, Nat};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use ic_cdk::api;
use ic_cdk_macros::{query, update};
use reqwest;  // Import the reqwest library for making HTTP requests

// Define a struct for user balances with serialization and deserialization for Candid
#[derive(Default, CandidType, Deserialize, Serialize)]
struct UserBalance {
    balances: HashMap<Principal, u64>, // Using u64 for balance
}

impl UserBalance {
    // Retrieve the balance for a specific user based on their Principal ID
    fn get_balance_for_user(&self, principal_id: &Principal) -> u64 {
        *self.balances.get(principal_id).unwrap_or(&0)
    }

    // Increment the balance for a specific user
    fn increment_balance_for_user(&mut self, principal_id: &Principal) {
        let balance = self.balances.entry(*principal_id).or_insert(0);
        *balance += 1;
    }
}

// Create a thread-local storage for the user balance state
thread_local! {
    static USER_BALANCE: RefCell<UserBalance> = RefCell::new(UserBalance::default());
}

// Query method to greet the user
#[query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// Update method to increment the balance for the caller
#[update]
fn increment_balance() {
    let caller = api::caller();
    USER_BALANCE.with(|balance| {
        let mut balances = balance.borrow_mut();
        balances.increment_balance_for_user(&caller);
    });
}

// Query method to retrieve the balance for a specific Principal
#[query]
fn get_balance(principal_id: Principal) -> Nat { 
    USER_BALANCE.with(|balance| {
        let balances = balance.borrow();
        let balance_for_user = balances.get_balance_for_user(&principal_id);
        Nat::from(balance_for_user)
    })
}

// Query method to get the current user's Principal ID as a string
#[query]
fn get_user_id() -> String {
    let caller = api::caller();
    caller.to_text()
}

// Update method to make an HTTP request using reqwest (useful for local development)
#[update]
async fn make_http_request() -> Result<String, String> {
    let url = "http://localhost:4943"; // ICP replica running locally

    // Use reqwest to make the HTTP GET request
    match reqwest::get(url).await {
        Ok(response) => {
            // Get the body of the response as text
            match response.text().await {
                Ok(body) => Ok(body),
                Err(err) => Err(format!("Failed to read response body: {}", err)),
            }
        },
        Err(err) => Err(format!("HTTP request failed: {}", err)),
    }
}
