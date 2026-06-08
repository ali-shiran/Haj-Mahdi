/* ============================================================
   Nirvana Massage | script.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("themeToggle");
  var phoneBtn = document.getElementById("phoneBtn");
  var smsBtn = document.getElementById("smsBtn");
  var toast = document.getElementById("toast");
  var phoneNumber = "09140445812";

  // تابع کمکی برای تشخیص موبایل بودن ابزار کاربر
  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /* ===== ۱. مدیریت هوشمند دکمه تماس تلفنی ===== */
  phoneBtn.addEventListener("click", function () {
    if (isMobileDevice()) {
      // در موبایل: مستقیم تماس می‌گیرد
      window.location.href = "tel:" + phoneNumber;
    } else {
      // در دسکتاپ: شماره را کپی می‌کند و پیام مناسب نشان می‌دهد
      copyToClipboard(phoneNumber, "شماره تلفن مطب کپی شد: " + phoneNumber);
    }
  });

  /* ===== ۲. مدیریت هوشمند دکمه پیامک ===== */
  if (smsBtn) {
    smsBtn.addEventListener("click", function () {
      var messageText = "سلام. وقت بخیر. درخواست دریافت آدرس و هماهنگی نوبت دارم.";
      if (isMobileDevice()) {
        window.location.href = "sms:" + phoneNumber + "?body=" + encodeURIComponent(messageText);
      }
    });
  }

  /* ===== تابع کپی در کلیپ‌بورد ===== */
  function copyToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(successMessage);
      }).catch(function () {
        showToast("کپی نشد! شماره مطب: " + text);
      });
    } else {
      // راه حل جایگزین برای مرورگرهای قدیمی
      var tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand("copy");
        showToast(successMessage);
      } catch (err) {
        showToast("شماره مطب: " + text);
      }
      document.body.removeChild(tempInput);
    }
  }

  /* ===== نمایش افکت توست (Toast) ===== */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
    }, 3000); // زمان نمایش مناسب برای خواندن شماره کپی‌شده
  }

  /* ===== ۳. مدیریت بدون باگ تم فعال ===== */
  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark");
      toggle.textContent = "☀️";
    } else {
      document.body.classList.remove("dark");
      toggle.textContent = "🌙";
    }
  }

  function getCurrentTheme() {
    var saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    return getSystemTheme();
  }

  applyTheme(getCurrentTheme());

  toggle.addEventListener("click", function () {
    var newTheme = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  }
});
