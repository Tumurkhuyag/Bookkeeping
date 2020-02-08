// Дэлгэцтэй ажиллах контроллор
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    totalIncomeLabel: ".budget__income--value",
    totalExpenseLabel: ".budget__expenses--value",
    balanceLabel: ".budget__value",
    expenseRatioLabel: ".budget__expenses--percentage"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    getDOMstrings: function() {
      return DOMstrings;
    },

    clearFields: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      // Convert List to Array
      var fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(el, index, array) {
        el.value = "";
      });

      fieldsArr[0].focus();

      // for (var i = 0; i < fieldsArr.length; i++) {
      //   fieldsArr[i].value = "";
      // }
    },

    showBalance: function(balance) {
      document.querySelector(DOMstrings.balanceLabel).textContent =
        balance.balance;
      document.querySelector(DOMstrings.totalIncomeLabel).textContent =
        balance.totalInc;
      document.querySelector(DOMstrings.totalExpenseLabel).textContent =
        balance.totalExp;
      document.querySelector(DOMstrings.expenseRatioLabel).textContent =
        balance.expenseRatio + "%";
    },

    addListItem: function(item, type) {
      // Орлого зарлагын элементийг агуулсан html -ийг бэлтгэнэ.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div>        </div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Тэр HTML дотроо орлого зардлуудын утгуудыг replace ашиглан өөрчилж өгнө.
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", item.value);

      // Бэлтгэсэн html -ээ DOM -руу хийж өгнө.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    }
  };
})();

// Санхүүтэй ажиллах контроллор
var financeController = (function() {
  // private function
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // private function
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Зардал болон орлогуудын нийлбэрийг олдог функц
  var calculateTotals = function(type) {
    var sum = 0;
    data.items[type].forEach(function(el) {
      sum = sum + el.value;
    });

    data.totals[type] = sum;
  };

  // private data
  var data = {
    items: {
      inc: [],
      exp: []
    },

    totals: {
      // Нийт орлого
      inc: 0,

      // Нийт зардал
      exp: 0
    },

    // Үлдэгдлийн дүн
    balance: 0,

    // Орлогогд эзлэх зардлын хувь
    expRatio: 0
  };

  return {
    calculateBalance: function() {
      // Орлогуудын нийлбэрийг олсон
      calculateTotals("inc");

      // Зардлуудын нийлбэрийг олсон
      calculateTotals("exp");

      // Балансыг тооцоолсон
      data.balance = data.totals.inc - data.totals.exp;

      // Орлогод эзлэх зардлын хувийг тооцоолсон
      data.expRatio = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    getBalance: function() {
      return {
        // Аль болох хамгийн бага өгөгдлийг бусдад ил болгосноор цаашид алдаа гарахгүй байх давуу талтай
        balance: data.balance,
        expenseRatio: data.expRatio,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      };
    },

    addItem: function(type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) {
        id = 1;
      } else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    },

    seeData: function() {
      return data;
    }
  };
})();

// Програмын холбогч контроллор
var appController = (function(uiController, financeController) {
  var ctrlAddItem = function() {
    // 1. Оруулах өгөгдлийг дэлгэцнээс олж авна.
    var input = uiController.getInput();

    if (input.description !== "" && input.value !== "") {
      // 2. Олж авсан өгөгдлөө санхүүгийн контроллорт дамжуулж, тэнд хадгална
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );
      // 3. Олж авсан өгөгдлөө веб дээр тохирох хэёэгт нь гаргана
      uiController.addListItem(item, input.type);
      uiController.clearFields();

      // 4. Төсвийг тооцоолно
      financeController.calculateBalance();

      // 5. Эцсийн үлдэгдлийг тооцоолно
      var balance = financeController.getBalance();

      // 6. Тооцоог дэлгэцэнд гаргана
      uiController.showBalance(balance);
      console.log(balance);
    }
  };

  var setupEventListeners = function() {
    var DOM = uiController.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function() {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function(event) {
      if ((event.keyCode === 13) | (event.which === 13)) {
        ctrlAddItem();
      }
    });
  };

  return {
    init: function() {
      console.log("Application started!");
      uiController.showBalance({
        // Програм эхэлхэд дэлгэцэнд харагдах балансын утгуудыг нойллох
        balance: 0,
        expenseRatio: 0,
        totalInc: 0,
        totalExp: 0
      });
      setupEventListeners();
    }
  };
})(uiController, financeController);

appController.init();
