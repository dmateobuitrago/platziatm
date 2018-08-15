class Bill{
 constructor(value, quantity){
  this.value = value;
  this.quantity = quantity;
 }
}

class Atm{
 constructor(bills){
  this.bills = bills;
 }

 getTotal(bills){
  var total = 0;
  bills.forEach(bill => {
   var subtotal = bill.value * bill.quantity;
   total += subtotal
  });

  return total;
 }

 checkBillsAvailability(entryValue, bills){
  var isDivisible = false;
  var isThereEnoughMoney = false;

  var total = this.getTotal(bills);

  if(total >= entryValue){
   isThereEnoughMoney = true;
  } else {
   return this.errorAtm(3);
  }

  bills.forEach(bill => {

   if(entryValue % bill.value == 0){
    isDivisible = true;
   }

  });

  if(!isDivisible){
   return this.errorAtm(2);
  }

  return true;
 }

 getDeliverBills(askedValue,bills){
   var leftMoneyToDeliver = askedValue;
   var billsToDeliver = [];

   bills.forEach(bill => {
    if(leftMoneyToDeliver > 0 && leftMoneyToDeliver >= bill.value){

      var deliverBillsQuantity = Math.floor(leftMoneyToDeliver/bill.value);

      // check if are there available bills of this value
      if (deliverBillsQuantity > bill.quantity){
        var difference = deliverBillsQuantity - bill.quantity;
        deliverBillsQuantity -= difference; 
      }

      var billToDeliver = new Bill(bill.value,deliverBillsQuantity);
      bill.quantity -= deliverBillsQuantity;


      if(bill.quantity >= 0){

        var amount = deliverBillsQuantity * bill.value;

        leftMoneyToDeliver -= amount;
    
        billsToDeliver.push(billToDeliver);

      }


    }
  });

  return billsToDeliver;
 }

 deliverBills(newBills){
  var billTemplate = '<div class="billDelivered">$ %value%</div>';
  var billShadow = '<div class="billShadow" style="top:%marginvalue%px;z-index:%zindex%;width:%width%%;"></div>';
  var fullPrint = "";
  newBills.forEach(newBill => {
    fullPrint += '<div>';
    var billsBack = "";
    var billFront = billTemplate.replace("%value%", newBill.value);
    var zindex = newBill.quantity;
    var width = 100;
    for(var i = 1; i<newBill.quantity; i++){
      var margin = i*-4;
      width -= i*2;
      var billBackTemp = billShadow.replace("%marginvalue%", margin);
      billBackTemp = billBackTemp.replace("%zindex%", zindex);
      billBackTemp = billBackTemp.replace("%width%", width);
      zindex -= 1;
      billsBack += billBackTemp;
    }
    fullPrint += billFront + billsBack;
    fullPrint += '</div>';
  });
  document.getElementById('bills').innerHTML =  fullPrint;
 }

 withdraw(){
  var userVal = document.getElementById('askedValue');
  var askedValue = parseInt(userVal.value);

  if(!askedValue){
   return this.errorAtm(1);
  }

  var areAvailiableBills = this.checkBillsAvailability(askedValue, this.bills);

  if(areAvailiableBills){
   var newBills = this.getDeliverBills(askedValue, this.bills);
   this.deliverBills(newBills);
  }

 }

 errorAtm(type){
  var message = "";
  switch(type){
   case 1:
    message = 'You should enter a number'
    break;
   case 2:
    message = 'This ATM do not have the type of bills to deliver that quantity.'
    break;
   case 3:
    message = 'You are out of founds.'
    break;
  }

  document.getElementById('errorMessage').innerHTML = message;
  document.getElementById('bills').innerHTML =  "";

 }
}

fiftyBills = new Bill(50,10);
twentyBills = new Bill(20,10);
tenBills = new Bill(10,10);

var bills = [fiftyBills,twentyBills,tenBills];

var atm = new Atm(bills);

var button = document.getElementById('atmButton');

button.addEventListener('click', function(){
 atm.withdraw();
});

