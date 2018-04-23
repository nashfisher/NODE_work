module.exports = function (){
    return {
      add: function(num1, num2) { 
            var sum = num1 + num2;
            return sum;   
            // add code here 
      },
      multiply: function(num1, num2) {
            var product = num1 * num2;
            return product;
            // add code here 
      },
      square: function(num) {
            var square = num * num;
            return square;
            // add code here 
      },
      random: function(num1, num2) {
            var rand = Math.floor(Math.random() * (num2 - num1) + num1);
            return rand;
            // add code here
      }
    }
  };
  