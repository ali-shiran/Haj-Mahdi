// مطمئن شدن از بارگذاری کامل ساختار DOM قبل از اجرای کدهای جاوااسکریپت
document.addEventListener("DOMContentLoaded", () => {
  
  // ۱. انتخاب المان‌های مورد نیاز با اعتبارسنجی ساده (Null Safety)
  const themeToggle = document.getElementById("themeToggle");
  const smsBtn = document.getElementById("smsBtn");
  const baleBtn = document.getElementById("baleBtn"); // دکمه بله
  const saveContactBtn = document.getElementById("saveContactBtn"); // دکمه ذخیره مخاطب/کارت ویزیت
  const shareBtn = document.getElementById("shareBtn");
  const toast = document.getElementById("toast");
  const body = document.body;

  // اطلاعات تماس و پیام پیش‌فرض اختصاصی
  const phoneNumber = "09140445812"; // شماره تماس مجموعه (در صورت نیاز این شماره را تغییر دهید)
  const messageText = "درود\nلطف کنین یک نوبت برام بزارین و آدرس رو هم برام ارسال کنین!";

  // تشخیص نوع دستگاه کاربر (موبایل یا دسکتاپ)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // ۲. مدیریت تعداد دکمه‌ها بر اساس دستگاه (۵ دکمه در موبایل، ۴ دکمه در دسکتاپ)
  if (!isMobile && saveContactBtn) {
    // پنهان کردن دکمه ذخیره مخاطب در نسخه دسکتاپ برای داشتن ۴ دکمه
    saveContactBtn.style.display = "none";
  }

  // ۳. مدیریت تغییر تم (تاریک / روشن)
  if (themeToggle) {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      body.classList.add("dark");
      themeToggle.textContent = "☀️";
    } else {
      body.classList.remove("dark");
      themeToggle.textContent = "🌙";
    }

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      const isDark = body.classList.contains("dark");
      themeToggle.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // ۴. مدیریت کلیک روی دکمه پیامک (SMS)
  if (smsBtn) {
    smsBtn.addEventListener("click", () => {
      if (isMobile) {
        // سناریوی موبایل: ارجاع مستقیم به برنامه پیامک با متن پیش‌فرض
        openSmsApp();
      } else {
        // سناریوی دسکتاپ: کپی کردن شماره در کلیپ‌بورد برای کاربر
        copyToClipboard(phoneNumber, "شماره تلفن در حافظه کپی شد! می‌توانید به آن پیامک دهید.");
      }
    });
  }

  // ۵. مدیریت کلیک روی دکمه بله (هم دسکتاپ هم موبایل با پیام پیش‌فرض)
  if (baleBtn) {
    baleBtn.addEventListener("click", (e) => {
      e.preventDefault(); // جلوگیری از رفتار پیش‌فرض لینک
      const encodedText = encodeURIComponent(messageText);
      // لینک مستقیم ارسال پیام در بله با متن پیش‌فرض
      const baleUrl = `https://ble.ir/${phoneNumber}?text=${encodedText}`;
      window.open(baleUrl, "_blank");
    });
  }

  // تابع باز کردن برنامه پیامک پیش‌فرض موبایل با متن آماده
  function openSmsApp() {
    const encodedText = encodeURIComponent(messageText);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // فرمت‌دهی لینک پیامک بر اساس سیستم‌عامل موبایل (iOS یا اندروید)
    const smsHref = isIOS 
      ? `sms:${phoneNumber};&body=${encodedText}` 
      : `sms:${phoneNumber}?body=${encodedText}`;

    const tempLink = document.createElement("a");
    tempLink.href = smsHref;
    tempLink.click();
  }

  // تابع کمکی کپی متن در کلیپ‌بورد با پشتیبانی کامل
  function copyToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showToast(successMessage))
        .catch(err => {
          console.error("خطا در کپی: ", err);
          fallbackCopyText(text, successMessage);
        });
    } else {
      fallbackCopyText(text, successMessage);
    }
  }

  // روش قدیمی کپی (Fallback) برای مرورگرهای دسکتاپ قدیمی
  function fallbackCopyText(text, successMessage) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      showToast(successMessage);
    } catch (err) {
      console.error("امکان کپی وجود ندارد.", err);
    }
    document.body.removeChild(textArea);
  }

  // ۶. مدیریت سیستم اشتراک‌گذاری پیش‌فرض موبایل (Web Share API)
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
        copyToClipboard(window.location.href, "لینک کارت ویزیت در حافظه کپی شد!");
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

// ۷. مدیریت محو شدن لودینگ پس از بارگذاری کامل صفحه
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("loader-hidden");
    }, 700);
  }
});
