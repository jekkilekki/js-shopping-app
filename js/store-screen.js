/* --------------------------------------------
 * App Setup
 * -------------------------------------------- */
// Declare empty arrays to contain our DOM Nodes
let ORIGINAL_STORE_ITEMS = [];
let CURRENT_STORE_ITEMS = [];
let CART_ITEMS = [];

// Setup the store with what we've already built in HTML
buildStore();

/* --------------------------------------------
 * Build the Store
 * -------------------------------------------- */
function buildStore() {
  var items = document.querySelectorAll('.store-list-item');
  
  for( var i = 0; i < items.length; i++ ) {
    // Add all items into our array that we never intend to modify -
    // This should always contain the original store items
    // so that we can always restore the original store
    ORIGINAL_STORE_ITEMS.push(items[i]);
    
    // Add some visual feedback when store items are clicked
    items[i].onmousedown = function(e) {
      highlightItem(e.currentTarget);
    }
    items[i].onmouseup = function(e) {
      highlightRemove(e.currentTarget);
    }
  }
}

/* --------------------------------------------
 * Change Store list view (grid / list)
 * -------------------------------------------- */
document.querySelector('.store-view').onclick = function() {
  if( document.getElementById('store-items').className === 'store-items list' ) {
    document.getElementById('store-items').className = 'store-items grid';
  } else {
    document.getElementById('store-items').className = 'store-items list';
  }
};

/* --------------------------------------------
 * Filter Store 
 * -------------------------------------------- */
// Add Event listener to Filter <select>
document.querySelector('.price-filter').addEventListener('change', function(e) {
  console.log('changed! ' + e.target.value);
  let newStore = filterStore(e.target.value);
  console.log('New Store:', newStore);
  
  redrawStore( newStore );
});

// Filter Store function
function filterStore( val ) {
  let originalStore = ORIGINAL_STORE_ITEMS;
  
  // remove all items from store
  document.getElementById('store-items').innerHTML = '';
  
  // sort store based on filter value
  let filteredStore = CURRENT_STORE_ITEMS.length === 0 
    ? ORIGINAL_STORE_ITEMS 
    : CURRENT_STORE_ITEMS;
  filteredStore.sort( function ( item1, item2 ) {
    let item1Price = parseFloat(item1.innerText.substring(
      item1.innerText.indexOf('$') + 1,
      item1.innerText.indexOf('Add')
    ).replace(/,/g, ''));
    let item2Price = parseFloat(item2.innerText.substring(
      item2.innerText.indexOf('$') + 1,
      item2.innerText.indexOf('Add')
    ).replace(/,/g, ''));
    
    if ( item1Price > item2Price ) {
      return 1;
    } else {
      return -1;
    }
  });
  
  console.log(filteredStore);
  if ( val === 'low' ) {
    console.log(filteredStore);
    return filteredStore;
  } else if ( val === 'high' ) {
    console.log(filteredStore);
    return filteredStore.reverse();
  } else {
    console.log(originalStore);
    return originalStore;
  }
}

/* --------------------------------------------
 * Search Store
 * -------------------------------------------- */
// Modify the original Add Button click function to now include Store Search
document.querySelector('.add-item-button').onclick = function() {
  if ( APP_PAGES.className === 'page-two' ) {
    storeSearch(); 
  } else if ( APP_PAGES.className === 'page-one' ) {
    addItem();
  }
}

// Search Store function
function storeSearch() {
  let query = STORE_INPUT.value.trim();
  if ( query === '' ) return;
  showToast('search', query);
  STORE_INPUT.value = '';
  
  // sort store based on filter value
  let originalStore = ORIGINAL_STORE_ITEMS;
  let newStore = [];
  
  // If query is multi-worded (not implemented yet)
  // let searchTerms = [];
  // if ( query.indexOf(' ') !== -1 ) {
  //   searchTerms = query.split(' ');
  //   console.log(searchTerms);
  // }
  for( var i = 0; i < originalStore.length; i++ ) {
    let item = originalStore[i].innerText.toLowerCase();
    if( item.indexOf( query.toLowerCase() ) !== -1 || originalStore[i].dataset.itemType === query ) {
      newStore.push(originalStore[i]);
    } 
  }
  
  // Set the found items to the current store items
  CURRENT_STORE_ITEMS = newStore;
  
  redrawStore( newStore );
  
  // reset filter
  document.querySelector('.price-filter').selectedIndex = 0;
  
  // display query results
  document.querySelector('.search-results').innerHTML = newStore.length + ' results for: ' + query;
  
  // add reset search button
  let reset = document.createElement('span');
  reset.className = 'reset-search';
  reset.innerHTML = '<i class="fa fa-times"></i>';
  reset.onclick = function() {
    redrawStore( ORIGINAL_STORE_ITEMS );
    document.querySelector('.search-results').innerHTML = '';
  }
  document.querySelector('.search-results').appendChild(reset);
}

/* --------------------------------------------
 * Redraw Store
 * -------------------------------------------- */
/* 
 * 1. Accepts a "store" array as an argument
 * 2. Erases all current store items and
 * 3. Redraws store argument elements
 */
function redrawStore( store ) {
  // remove all items from store
  document.getElementById('store-items').innerHTML = '';
  
  var newItem = null;
  for( var i = 0; i < store.length; i++ ) {
    newItem = document.createElement('li');
    newItem.className = 'store-list-item';
    newItem.innerHTML = store[i].innerHTML;
    
    // Add some visual feedback when store items are clicked
    newItem.onmousedown = function(e) {
      highlightItem(e.currentTarget);
    }
    newItem.onmouseup = function(e) {
      highlightRemove(e.currentTarget);
    }
    
    document.getElementById('store-items').appendChild(newItem);
  }
}

/* --------------------------------------------
 * Visual Feedback 
 * (highlight and add to cart when clicked)
 * -------------------------------------------- */
function highlightItem( item ) {
  var pseudoItem = document.createElement('span');
  pseudoItem.className = 'pseudo-store-item selected';
  item.appendChild(pseudoItem);
}

function highlightRemove( item ) {
  item.lastChild.remove();
  storeAddToCart(item);
}

/* --------------------------------------------
 * Add Item to Cart
 * -------------------------------------------- */
function storeAddToCart( item ) {
  // Doctor up the item we're adding - making it specific for the cart
  var tempItem = item.cloneNode(true);
  
  CART_ITEMS.push(tempItem);
  CART_COUNT.innerHTML = parseInt(CART_COUNT.innerHTML) + 1;
  CART_COUNT.className = 'shopping-cart-count jiggle';
  setTimeout( function() {
    CART_COUNT.className = 'shopping-cart-count';
  }, 500);
  
  showToast('click-add');
  
  // Add to Cart Screen
  document.getElementById('cart-items').appendChild(tempItem);
}
