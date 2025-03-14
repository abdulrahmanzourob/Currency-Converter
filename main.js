// دالة مشتركة لتحويل العملة
async function convertCurrency() {
  const amount = document.querySelector(".amount").value;
  const fromCurrency = document.querySelector(".from-currency").value;
  const toCurrency = document.querySelector(".to-currency").value;
  const resultDiv = document.querySelector(".result");

  // التحقق من صحة المبلغ المدخل
  if (!amount || isNaN(amount) || amount <= 0) {
    resultDiv.style.display = "block";
    resultDiv.textContent = "Please enter a valid amount.";
    return;
  }

  const apiKey = "986ce212ea2b4672a33434c850a933e6";
  const apiUrl = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}`;

  try {
    // جلب البيانات من الـ API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API.");
    }

    const data = await response.json();
    const fromRate = data.rates[fromCurrency];
    const toRate = data.rates[toCurrency];

    // التأكد من أن العملتين مدعومتين
    if (!fromRate || !toRate) {
      resultDiv.style.display = "block";
      resultDiv.textContent = "Currency not supported.";
      return;
    }

    // تحويل المبلغ
    const convertedAmount = ((amount / fromRate) * toRate).toFixed(2);
    resultDiv.style.display = "block";
    resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;

    // حفظ القيم في Local Storage
    localStorage.setItem('amount', amount);
    localStorage.setItem('fromCurrency', fromCurrency);
    localStorage.setItem('toCurrency', toCurrency);

  } catch (error) {
    resultDiv.style.display = "block";
    resultDiv.textContent = "An error occurred. Please try again later.";
    console.error(error);
  }
}

// ربط الزر بالـ click
document.querySelector(".convert").addEventListener("click", convertCurrency);

// ربط الـ input بالـ keydown
document.querySelector(".amount").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    convertCurrency(); // استدعاء نفس الدالة
  }
});

// عند تحميل الصفحة، نتحقق إذا كان هناك قيم محفوظة في Local Storage
window.addEventListener("load", () => {
  const savedAmount = localStorage.getItem('amount');
  const savedFromCurrency = localStorage.getItem('fromCurrency');
  const savedToCurrency = localStorage.getItem('toCurrency');

  // إذا كانت القيم موجودة في الـ Local Storage، نعرضها في الحقول
  if (savedAmount) {
    document.querySelector(".amount").value = savedAmount;
  }
  if (savedFromCurrency) {
    document.querySelector(".from-currency").value = savedFromCurrency;
  }
  if (savedToCurrency) {
    document.querySelector(".to-currency").value = savedToCurrency;
  }
});
