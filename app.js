// Дэлгэцтэй ажиллах контроллор
var uiController = (function() {})();

// Санхүүтэй ажиллах контроллор
var financeController = (function() {})();

// Програмын холбогч контроллор
var appController = (function(uiController, financeController) {
  var ctrlAddItem = function() {
    console.log("Өгөгдлийг дэлгэцнээс авах хэсэг");
    // 1. Оруулах өгөгдлийг дэлгэцнээс олж авна.
    // 2. Олж авсан өгөгдлөө санхүүгийн контроллорт дамжуулж, тэнд хадгална
    // 3. Олж авсан өгөгдлөө веб дээр тохирох хэёэгт нь гаргана
    // 4. Төсвийг тооцоолно
    // 5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана
  };

  document.querySelector(".add__btn").addEventListener("click", function() {
    ctrlAddItem();
  });

  document.addEventListener("keypress", function(event) {
    if ((event.keyCode === 13) | (event.which === 13)) {
      ctrlAddItem();
    }
  });
})(uiController, financeController);
