use std::collections::HashMap;
use candid::{CandidType, Principal, Nat};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use ic_cdk::{query, update, caller}; 

// Structure to store each user's balance in a hashmap associated with user ID).
#[derive(Default, CandidType, Deserialize, Serialize)]
struct UserBalance {
    // Using u64 for balance
    balances: HashMap<Principal, u64>, 
}

// Global variable for storing and user balances.
thread_local! {
    static USER_BALANCE: RefCell<UserBalance> = RefCell::new(UserBalance::default());
}

// Increment balance for the specified user
#[update]
fn increment_balance_for_user(user: Principal) {
    USER_BALANCE.with(|balance| {
        let mut balances = balance.borrow_mut();
        // Get the user's balance or set to 0 if not yet set
        let user_balance = balances.balances.entry(user).or_insert(0u64);
        // Increment the balance by 1
        *user_balance += 1; 
    });
}

// Get the balance for the authenticated user
#[query]
fn get_balance() -> Nat {
    let caller = caller(); // Get the caller's principal (authenticated user)
    USER_BALANCE.with(|balance| {
        let balances = balance.borrow();
        // Return balance as Nat (handles large integers)
        Nat::from(*balances.balances.get(&caller).unwrap_or(&0)) 
        
    })
}

// Get the balance for a specific user by their principal id
#[query]
fn get_balance_for_user(user: Principal) -> Nat {
    USER_BALANCE.with(|balance| {
        let balances = balance.borrow();
        // Return balance as Nat and return zero if not found
        Nat::from(*balances.balances.get(&user).unwrap_or(&0)) 
    })
}

// Get the authenticated user's ID
#[query]
fn get_user_id() -> String {
    // Get the caller's principal
    let caller = caller(); 
    // Return the caller's principal ID as a string
    caller.to_text() 
}

// Enable Candid export
ic_cdk::export_candid!();
