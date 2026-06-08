// مطمئن شدن از بارگذاری کامل ساختار DOM قبل از اجرای کدهای جاوااسکریپت
document.addEventListener("DOMContentLoaded", () => {
  
  // ۱. انتخاب المان‌های مورد نیاز با اعتبارسنجی ساده (Null Safety)
  const themeToggle = document.getElementById("themeToggle");
  const smsBtn = document.getElementById("smsBtn");
  const shareBtn = document.getElementById("shareBtn");
  const toast = document.getElementById("toast");
  const body = document.body;

  // شماره تماس مجموعه جهت استفاده در بخش کپی پیامک
  const phoneNumber = "09131234567"; 

  // ۲. مدیریت تغییر تم (تاریک / روشن)
  if (themeToggle) {
    // خواندن تم ذخیره شده از مراجعات قبلی کاربر
    const savedTheme = localStorage.getItem("theme");
    // تشخیص تم پیش‌فرض سیستم‌عامل کاربر
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // اعمال تم بر اساس حافظه یا سیستم‌عامل
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      body.classList.add("dark");
      themeToggle.textContent = "☀️";
    } else {
      body.classList.remove("dark");
      themeToggle.textContent = "🌙";
    }

    // عملکرد دکمه تعویض دستی تم
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      const isDark = body.classList.contains("dark");
      
      // تغییر اموجی دکمه متناسب با تم جدید
      themeToggle.textContent = isDark ? "☀️" : "🌙";
      // ذخیره دائمی انتخاب کاربر در مرورگر
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // ۳. مدیریت کلیک روی دکمه پیامک (کپی کردن شماره)
  if (smsBtn) {
    smsBtn.addEventListener("click", () => {
      // استفاده از ویژگی استاندارد ناوبری مرورگرها برای مدیریت کلیپ‌بورد
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phoneNumber)
          .then(() => showToast("شماره کپی شد! می‌توانید آن را پیامک کنید."))
          .catch(err => {
            console.error("خطا در کپی خودکار شماره: ", err);
            fallbackCopyText(phoneNumber);
          });
      } else {
        // روش جایگزین برای مرورگرهای قدیمی فاقد Clipboard API
        fallbackCopyText(phoneNumber);
      }
    });
  }

  // روش قدیمی کپی (Fallback) در صورت پشتیبانی نکردن مرورگر از متدهای جدید
  function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // خارج کردن المان از دید مستقیم کاربر
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      showToast("شماره کپی شد! می‌توانید آن را پیامک کنید.");
    } catch (err) {
      console.error("امکان کپی شماره وجود ندارد.", err);
    }
    document.body.removeChild(textArea);
  }

  // ۴. مدیریت سیستم اشتراک‌گذاری پیش‌فرض موبایل (Web Share API)
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: 'نیروانا ماساژ',
          text: 'کارت ویزیت دیجیتال نیروانا ماساژ - بازیابی سلامت جسمانی شما',
          url: window.location.href
        })
        .then(() => console.log('اشتراک‌گذاری موفقیت‌آمیز بود.'))
        .catch((error) => console.log('خطا یا انصراف از اشتراک‌گذاری:', error));
      } else {
        // اگر مرورگر دسکتاپ بود یا از Share API پشتیبانی نمی‌کرد، آدرس سایت را کپی می‌کنیم
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(window.location.href)
            .then(() => showToast("لینک کارت ویزیت در حافظه کپی شد!"))
            .catch(err => console.error(err));
        }
      }
    });
  }

  // نمایش باکس شناور پیام تایید (Toast) با متن دلخواه
  function showToast(message) {
    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    }
  }
});

// ۵. مدیریت محو شدن لودینگ پس از بارگذاری کامل صفحه
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    // ایجاد تاخیر کوتاه ۷۰۰ میلی‌ثانیه‌ای جهت کامل شدن انیمیشن زیبای لوگو
    setTimeout(() => {
      loader.classList.add("loader-hidden");
    }, 700);
  }
});
