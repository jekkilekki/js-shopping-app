/* --------------------------------------------
 * App Setup
 * -------------------------------------------- */
// App Buttons
const APP_PAGE_BUTTONS = document.querySelectorAll(".app-nav-item");
const SHOPPING_LIST_BUTTON = document.getElementById("shopping-list-button");
const SEARCH_STORE_BUTTON = document.getElementById("search-store-button");
const SHOPPING_CART_BUTTON = document.getElementById("shopping-cart-button");
const SHOPPING_CART_ICON = document.getElementById("go-to-cart");
const MORE_BUTTON = document.querySelector(".read-me-button");

// App Pages (Screens)
const INFO_PAGE = document.querySelector(".info-page");
const APP_PAGES = document.getElementById("pages");

// Toast (for visual feedback)
const TOAST = document.querySelector('.toast');

// Input field & button - need to be able to be modified on each screen
let STORE_BUTTON = document.querySelector('.add-item-button');
let STORE_INPUT = document.getElementById('add-item-input');

/* --------------------------------------------
 * Change screens
 * -------------------------------------------- */
SHOPPING_LIST_BUTTON.onclick = function() { viewScreen(1); };
SEARCH_STORE_BUTTON.onclick = function() { viewScreen(2); };
SHOPPING_CART_BUTTON.onclick = function() { viewScreen(3); };
SHOPPING_CART_ICON.onclick = function() { viewScreen(3); };
MORE_BUTTON.onclick = function() { readInfo(); };

/* --------------------------------------------
 * View Screen function
 * -------------------------------------------- */
function viewScreen(num = 1) {
  let engNum = '';
  switch(num) {
    // We can safely ignore case 1 because the default handles this
    case 2:
      engNum = 'two';
      changeInput('Search store', 'search');
      break;
    case 3: 
      engNum = 'three';
      changeInput('Search cart', 'search-dollar', true);
      break;
    default:
      engNum = 'one';
      changeInput('Add to cart', 'plus');
  }
  
  APP_PAGES.className = "page-" + engNum;
  
  for (var i = 0; i < APP_PAGE_BUTTONS.length; i++) {
    // Reset `active` class on all nav buttons
    APP_PAGE_BUTTONS[i].className = "app-nav-item";
  }
  // Set `active` on Shopping List button only (current screen)
  APP_PAGE_BUTTONS[num - 1].className = "app-nav-item active";
};

/* --------------------------------------------
 * Change Input Field & Button values
 * -------------------------------------------- */
function changeInput(placeholder, icon, disabled = false) {
  STORE_BUTTON.className = "button add-item-button " + icon;
  
  // Change input button icon
  STORE_BUTTON.innerHTML = '<i class="fa fa-' + icon + '"></i>';
  STORE_INPUT.className = icon;
  
  // Change input field placeholder
  STORE_INPUT.placeholder = placeholder;
  
  // If disabled, mark BOTH the input field and its container disabled
  // (this is due to CSS styling) - else, unmark them 
  if ( disabled ) {
    STORE_INPUT.setAttribute("disabled", true);
    document.querySelector('.add-item-container').className = 'add-item-container disabled';
  } else {
    STORE_INPUT.removeAttribute("disabled");
    document.querySelector(".add-item-container").className =
    "add-item-container";
  }
}

/* --------------------------------------------
 * View Information Screen
 * -------------------------------------------- */
function readInfo() {
  if (INFO_PAGE.className === "screen info-page active expanded") {
    INFO_PAGE.className = "screen info-page active";
  } else {
    INFO_PAGE.className = INFO_PAGE.className + " expanded";
  }
}

/* --------------------------------------------
 * Helper Functions
 * -------------------------------------------- */
/*
 * Show Toast (Visual feedback for various app actions)
 */
function showToast(type, query = "") {
  var msg = "";
  switch (type) {
    case "click-add":
      msg = "Item added to cart!";
      break;
    case "manual-add":
      msg = query + " added to shopping list!";
      break;
    case "click-remove":
      msg = "Item remove from cart!";
      break;
    case "click-purchased":
      msg = "Item checked off your list!";
      break;
    case "delete":
      msg = "Item deleted from list!";
      break;
    case "add":
      msg = "Item added to list!";
      break;
    case "remove-all":
      msg = "Removing all items from cart.";
      break;
    case "delete-all":
      msg = "Deleting all list items.";
      break;
    case "reset-list":
      msg = "List reset to defaults.";
      break;
    case "search":
      msg = "Searching store for: " + query;
      break;
    default:
      msg = "Some event happened! But what was it? Were you paying attention?";
  }

  // Set Toast's message
  TOAST.innerHTML = msg;
  
  // Add the class to position Toast just under the phone screen
  TOAST.className += " show-toast";
  
  setTimeout(function() {
    TOAST.className = "toast";
  }, 1400); // Remove toast after 1.4s
}
