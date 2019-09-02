/* --------------------------------------------
 * iPhone Clock
 * -------------------------------------------- */
// iPhone clock interval, every second (1000ms)
setInterval(function() {
  displayTime();
}, 1000); // every second update displayTime()

// Function that controls the iPhone time display
function displayTime() {
  let iPhoneClock = new Date(); // Built in JS Date Object
  let hours = iPhoneClock.getHours();
  let minutes = iPhoneClock.getMinutes();
  let seconds = iPhoneClock.getSeconds();

  // minutes and seconds are returned as integers without preceding zeroes
  // the following two conditionals append a leading zero
  // if minutes or seconds are less than 10 (i.e. 09, 08, etc)
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  // Set the value of the #time element to "h:mm:ss"
  document.getElementById("time").innerHTML =
    hours + ":" + minutes + ":" + seconds;
}

/* --------------------------------------------
 * Create Default (Original) List
 * -------------------------------------------- */
let ORIGINAL_LIST = [];

buildOriginalList();

// Find all the items already in our shopping list 
// & add them to our ORIGINAL_LIST array
function buildOriginalList() {
  var items = document.querySelectorAll('.list-item');
  for( var i = 0; i < items.length; i++ ) {
    ORIGINAL_LIST.push(items[i]);
  }
  console.log( ORIGINAL_LIST );
}

/* --------------------------------------------
 * Add Items (input)
 * -------------------------------------------- */
// Add Item BUTTON
document.querySelector('.add-item-button').onclick = function() {
  if ( document.getElementById('pages').className === 'page-one' ) {
    addItem(); 
  }
}

function addItem(el = null, useToast = true) {
  // Create a new `li` list item and set its values and attributes
  var newItem = document.createElement("li");
  
  // If passing in an element (i.e. we're resetting the list),
  // Get its innerText - minus the price at the end,
  // OR grab the value from the input field instead.
  var newItemName = el !== null 
    ? el.innerText.slice(0, el.innerText.indexOf('$')) 
    : document.getElementById("add-item-input").value.trim();
  
  // Be sure the input field actually has a value (non-empty)
  if ( newItemName === '' ) return;
  
  newItem.innerHTML = newItemName;
  // `new` CSS class = height: 0, opacity: 0 (an invisible element)
  newItem.className = "list-item new";
  newItem.setAttribute("draggable", true);

  // We need a setTimeout function in order to allow
  // the CSS transition in list-item to happen
  setTimeout(function() {
    // `hot` CSS class is the red we have, full height, 100% opacity
    newItem.className = "list-item hot";
  }, 0);
  
  // Don't forget to add the click & drag functionality to all list items
  newItem.onclick = function() { handleClick(this); };
  newItem.ondrag = function() { handleDelete(this); };
  
  // Append the new item to our list
  document.querySelector("#shopping-list.list-section").appendChild(newItem);
  
  // Finally, reset the input field to be empty
  document.getElementById("add-item-input").value = "";
  
  // *** Toast will be used in the following app iteration
  showToast("manual-add", newItemName);
};

// Add Item with ENTER
// Add item on keyboard ENTER
document.getElementById("add-item-input").onkeyup = function(event) {
  if (event.keyCode === 13) {
    // Run the `onclick` function we wrote above
    document.querySelector(".add-item-button").click();
  }
};

/* --------------------------------------------
 * "Purchase" Items (click)
 * -------------------------------------------- */
// Get the current (default) list of items and give them all a click function
var listItemArray = document.querySelectorAll(".list-item");
for (var i = 0; i < listItemArray.length; i++) {
  listItemArray[i].onclick = function() {
    handleClick(this);
  };
  listItemArray[i].ondrag = function() {
    handleDelete(this);
  }
}

function handleClick(item) {
  if (item.className === "list-item hot") {
    item.className = "list-item purchased";
    handlePurchase(item);
  } else {
    item.className = "list-item hot";
    handleReturn(item);
  }
}

// --------------------------------------------
/*
 * A few constants that we will refer to over and over again
 */
const TRASH_ICON = '<i class="fa fa-times"></i>';
const CART_COUNT = document.querySelector('.shopping-cart-count');

/* 
 * Supplementary Purchase item function - adding visual feedback 
 */
function handlePurchase(el) {
  
  // Create a Trash / Remove button and add it to the element
  var trash = document.createElement("button");
  trash.className = "delete-button";
  trash.innerHTML = TRASH_ICON;
  trash.style.cursor = 'pointer';
  el.appendChild(trash);

  // Create a pseudo-element to "zoom" into the cart
  var zoom = document.createElement("span");
  zoom.className = "pseudo-item";
  el.appendChild(zoom);
  setTimeout(function() {
    zoom.className += " to-cart";
    // parentNode.offsetTop is important to make all the elements
    // end up in the same place, over the cart button
    zoom.style.transform =
      "translateY(-" + (zoom.parentNode.offsetTop + 5) + "px)";
  }, 100); // Begin the transition `to-cart` after 100ms
  setTimeout(function() {
    zoom.remove();
  }, 1200); // Remove the pseudo-element after 1200ms (1.2s)
  
  // Increase cart count
  CART_COUNT.innerHTML = parseInt(CART_COUNT.innerHTML) + 1;
  
  // *** Toast will be used in the following app iteration
  showToast("click-add");
}

/* 
 * Supplmentary Return item function - fixing what the previous function added 
 */
function handleReturn(el, useToast = true) {
  // Reduce cart count
  if (
    CART_COUNT.innerHTML !== "0" &&
    (el.lastChild.innerHTML === TRASH_ICON ||
      el.lastChild.previousSibling.innerHTML === TRASH_ICON)
  ) {
    CART_COUNT.innerHTML = parseInt(CART_COUNT.innerHTML) - 1;
    CART_COUNT.className = "shopping-cart-count jiggle";
    setTimeout(function() {
      CART_COUNT.className = "shopping-cart-count";
    }, 500);
  }
  // Remove child elements
  removeTrash(el);
  // Reset class name
  el.className = 'list-item hot';
  
  // *** Toast will be used in the following app iteration
  if (useToast) {
    showToast("click-remove");
  }
}

// Function to remove the trash icon
function removeTrash(el) {
  if (el.lastChild.innerHTML === TRASH_ICON) {
    // If we only have a trash icon
    el.lastChild.remove();
  } else if (el.lastChild.previousSibling.innerHTML === TRASH_ICON) {
    // If there's a trash AND a moving item - then remove the TWO children
    el.lastChild.remove();
    el.lastChild.remove();
  }
}

/* --------------------------------------------
 * Delete Items (drag)
 * -------------------------------------------- */
/* 3. Delete item function (used in handlePurchase()) */
function handleDelete(el, useToast = true) {
  el.className += " delete";
  setTimeout(function() {
    el.remove();
  }, 750);
  
  // *** Toast will be used in the following app iteration
  if (useToast) {
    showToast("delete");
  }
}

/* --------------------------------------------
 * Empty Cart
 * - All list items return to red color, no strikethrough, no trash
 * - Cart count decreases by 1 as it counts down, but eventually zeroes out (after 1.5s)
 * -------------------------------------------- */
var emptyCart = document.querySelector(".empty-cart-button");
emptyCart.onclick = function() {
  allTask("empty-cart", "remove-all");
  setTimeout(function() {
    CART_COUNT.innerHTML = 0;
  }, 1500); /* Actual time for 6 items will be 3000 because 500 * 6 in delayedResponse() */
};

/* --------------------------------------------
 * Delete List
 * - All list items are sequentially "dragged" off screen and removed
 * -------------------------------------------- */
var deleteAll = document.querySelector(".delete-all-button");
deleteAll.onclick = function() {
  allTask("delete-list", "delete-all");
};

/* --------------------------------------------
 * Reset List
 * - All (original) list items are sequentially added back into the list 
 * -------------------------------------------- */
var resetList = document.querySelector(".reset-list-button");
resetList.onclick = function() {
  allTask("reset-list", "reset-list", true);
  setTimeout(function() {
    console.log("after reset", ORIGINAL_LIST);
  }, 3000);
};

/* --------------------------------------------
 * Helper Functions
 * - allTask( taskName, showToast, useOriginalList)
 * - delayedResponse( element, index, taskName )
 * -------------------------------------------- */
function allTask(task, toast, originalList = false) {
  var currentItems = document.querySelectorAll(".list-item");
  if (!originalList) {
    for (var i = 0; i < currentItems.length; i++) {
      delayedResponse(currentItems[i], i, task);
    }
  } else {
    CART_COUNT.innerHTML = "0";
    for (var i = 0; i < ORIGINAL_LIST.length; i++) {
      delayedResponse(ORIGINAL_LIST[i], i, task);
    }
  }
  
  // *** Toast will be used in the following app iteration
  setTimeout(function() {
    showToast(toast);
  }, currentItems.length * 100);
}

/* Delayed item animation */
function delayedResponse(el, i, task) {
  switch (task) {
    case "empty-cart":
      setTimeout(function() {
        handleReturn(el, false);
      }, 500 * i);
      break;
    case "delete-list":
      setTimeout(function() {
        handleDelete(el, false);
      }, 500 * i);
      break;
    case "reset-list":
      setTimeout(function() {
        addItem(el, false);
      }, 500 * i);
      break;
  }
}
