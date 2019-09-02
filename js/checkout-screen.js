/* --------------------------------------------
 * Calculate Total
 * -------------------------------------------- */
let TOTAL_PRICE = document.getElementById('cartTotalPrice');
let CART_QUANTITY = document.querySelector('.checkout-button');
let PAY_BUTTON = document.querySelector('.pay-button');
let POPUP = document.querySelector('.app-module');
let POPUP_WINDOW = document.querySelector('.app-module-content');

var popupClicked = 0;
var cart = document.querySelector('#cart-items');
var cartCount = 0;
var totalPrice = 0;
var cartItems = [];

var observer = new MutationObserver( function(mutations) {
  mutations.forEach( function(mutation) {
    console.log(mutation.addedNodes);
    
    // Add item to cart (and increase cartCount)
    cartCount++;
    CART_QUANTITY.innerHTML = 'Checkout (' + cartCount + ')';
    
    // Add Prices
    totalPrice = parseFloat(TOTAL_PRICE.innerHTML) + parseFloat(mutation.addedNodes[0].dataset.itemPrice);
    TOTAL_PRICE.innerHTML = totalPrice.toFixed(2);
    
    cartItems.push({
      itemName: mutation.addedNodes[0].innerText,
      itemPrice: mutation.addedNodes[0].dataset.itemPrice
    })
  });
});

var config = { attributes: false, childList: true, characterData: false }

observer.observe(cart, config);

// observer.disconnect();

CART_QUANTITY.onclick = function() {
  if ( cartCount > 0 ) { 
    buildCheckoutScreen();
  }
}

POPUP_WINDOW.onclick = function() {
  popupClicked = true;
  setTimeout( function() {
    popupClicked = false;
  }, 500 );
} 

POPUP.onclick = function() {
  if ( !popupClicked ) {
  document.querySelector('.module-content').innerHTML = '';
  closePopup();
  }
}

function closePopup() {
  POPUP.style.display = 'none';
}

function payForIt() {
  // Reset the header
  document.querySelector('.module-header').innerHTML = 'Order Placed!';
  
  // Add confirmation message
  document.querySelector('.module-content').innerHTML = '<img src="https://media1.tenor.com/images/cb936926d59302a4944281af827f8992/tenor.gif" width="300" /><p>We are preparing your order for shipment!</p>';
  
  var closeButton = document.createElement('button');
  closeButton.className = 'close-payment-button checkout-button';
  closeButton.innerHTML = 'Close';
  closeButton.onclick = function() { closePopup(); };
  document.querySelector('.module-content').appendChild(closeButton);
  
  // "Turn off" module after 5 seconds
  setTimeout( function() {
    if ( POPUP.style.display === 'block' ) {
      POPUP.style.display = 'none';
    }
  }, 5000);
}

function buildCheckoutScreen() {
  // Build header
  document.querySelector('.module-header').innerHTML = 'Checking out ' + cartCount + (cartCount > 1 ? ' items.' : ' item.');
  let popupContent = document.querySelector('.module-content');
  
  // Build address / contact info area
  createPopupBox('Address | COEX', '서울특별시 강남구 영동대로 513 (삼성동, 코엑스) 06164', popupContent, 'Phone: 02-6000-0114');
  
  // Shipping options
  createPopupBox('Receiving', 'Delivery to front door (or leave at Guard House)', popupContent);
  
  // Payment options
  createPopupBox('Payment Method', ['Cell phone (KT)', 'KakaoPay', 'Bank Transfer'], popupContent);
  
  // Order summary
  var shipment = document.createElement('h2');
  shipment.innerHTML = 'Shipment 1 of 1';
  popupContent.appendChild(shipment);
  
  var shipmentBox = document.createElement('ul');
  shipmentBox.className = 'order-summary';
  var shipmentBoxTitle = document.createElement('h3');
  shipmentBoxTitle.innerHTML = 'Expected Arrival: 9/3';
  shipmentBox.appendChild(shipmentBoxTitle);
  
  cartItems.forEach( function(item) {
    var shipmentItem = document.createElement('li');
    shipmentItem.className = 'order-summary-item';
    
    var shipmentItemName = document.createElement('span');
    shipmentItemName.innerHTML = item.itemName.split('\n')[0];
    var shipmentItemPrice = document.createElement('strong');
    shipmentItemPrice.innerHTML = item.itemPrice;
    
    shipmentItem.appendChild(shipmentItemName);
    shipmentItem.appendChild(shipmentItemPrice);
    
    shipmentBox.appendChild(shipmentItem);
  });
  
  // Subtotal
  var discount = totalPrice * 0.005;
  var shippingFee = totalPrice * 0.05;
  var coupon = totalPrice * 0.02;
  var adjustedTotal = totalPrice - discount - coupon + shippingFee;
  
  subtotalFields('p', 'Subtotal', totalPrice, shipmentBox);
  // Discount
  subtotalFields('p', 'Discount', discount, shipmentBox);
  // Shipping Fee
  subtotalFields('p', 'Shipping Fee', shippingFee, shipmentBox);
  // Coupon
  subtotalFields('p', 'Coupon', coupon, shipmentBox);
  
  popupContent.appendChild(shipmentBox);
  
  // Adjusted Total
  subtotalFields('h2', 'Final Total', adjustedTotal, popupContent, 'adjusted-total');
  
  // Create payment button
  var payButton = document.createElement('button');
  payButton.className = 'pay-button checkout-button';
  payButton.innerHTML = 'Pay';
  payButton.onclick = function() { payForIt(); };
  popupContent.appendChild(payButton);
  
  // Terms of Service
  var terms = document.createElement('small');
  terms.className = 'terms';
  terms.innerHTML = 'By clicking the above PAY button, you agree to Store\'s Terms of Service.';
  popupContent.appendChild(terms);
  
  // Display popup box
  POPUP.style.display = 'block';
}

function createPopupBox(boxTitle, boxContent, parentNode, extraInfo = '') {
  // Create a small content box
  var box = document.createElement('div');
  box.className = 'module-content-container';
  
  // Create a header and add it to the content box
  var title = document.createElement('h2');
  title.className = 'module-content-header';
  title.innerHTML = boxTitle;
  
  box.appendChild(title);

  // Create the box content and add it to the box
  var content = document.createElement('p');
  content.className = 'module-content-content';
  content.innerHTML = (boxContent instanceof Array ? boxContent[0] : boxContent) + 
    (extraInfo !== '' ? ('<br>' + extraInfo) : '');
    
  box.appendChild(content);
    
  var subContent = null;
  // But, if the boxContent is an array, we need to create another sub-box
  if ( boxContent instanceof Array ) {   
    // Create a list
    subContent = document.createElement('ul');
    subContent.className = 'module-content-list';
    
    // for every item, add it
    boxContent.forEach( function(item) {
      // Create a list item
      var subContentItem = document.createElement('li');
      
      // Create a radio button and add it to the li
      var subContentRadio = document.createElement('input');
      subContentRadio.setAttribute('type', 'radio');
      if ( boxContent[0] === item ) {
        subContentRadio.checked = true;
      }
      subContentItem.appendChild(subContentRadio);
      
      // Create the radio button title and add it to the li
      var subContentText = document.createElement('span');
      subContentText.innerHTML = item;
      subContentItem.appendChild(subContentText);
      
      // Now, finally, add the whole li to the ul list
      subContent.appendChild(subContentItem);
    })
    
    // Add the ul list to the box
    box.appendChild(subContent);
  }
  
  // Create an arrow and add it to the box
  var arrow = document.createElement('i');
  arrow.className = 'fa fa-chevron-right';
  arrow.style.cursor = 'pointer';
  box.appendChild(arrow);
  
  // Finally, attach the whole box to the module
  parentNode.appendChild(box);
  if ( subContent !== null ) {
    parentNode.appendChild(subContent);
  }
}

function subtotalFields(element, subTitle, subContent, parentNode, className = '') {
  var field = document.createElement(element);
  field.innerHTML = '<span>' + subTitle + '</span><strong>' + subContent.toFixed(2) + '</strong>';
  if ( className !== '' ) {
    field.className = className;
  }
  parentNode.appendChild(field);
}