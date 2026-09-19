/* ==========================================================================
   河南德航建设工程有限公司 · 官网交互脚本
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- 页脚年份 / 公司年限 ---------- */
  var year = new Date().getFullYear();
  document.getElementById("footerYear").textContent = year;
  document.getElementById("companyYears").textContent = year - 1998;

  /* ---------- 顶部导航：滚动状态 ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- 移动端菜单 ---------- */
  var nav = document.getElementById("mainNav");
  var navToggle = document.getElementById("navToggle");
  function closeMenu() {
    nav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "打开菜单");
    document.body.style.overflow = "";
  }
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    document.body.style.overflow = open ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---------- 导航高亮（滚动监听） ---------- */
  var navLinks = nav.querySelectorAll("a");
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    if (id && id.startsWith("#")) {
      var sec = document.querySelector(id);
      if (sec) sections.push({ link: link, sec: sec });
    }
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var current = sections.find(function (s) { return s.sec === entry.target; });
        if (current) {
          navLinks.forEach(function (l) { l.classList.remove("active"); });
          current.link.classList.add("active");
        }
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(function (s) { spy.observe(s.sec); });

  /* ---------- 滚动显现动画（含逐项延迟） ---------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) {
    var d = el.getAttribute("data-delay");
    if (d) el.style.transitionDelay = parseInt(d, 10) * 0.09 + "s";
    revealObserver.observe(el);
  });

  /* ---------- 数字滚动动画 ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
      el.textContent = Math.round(target * eased).toLocaleString("zh-CN");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".count").forEach(function (el) { countObserver.observe(el); });

  /* ---------- 首屏视频：加载成功渐显，失败保留海报 ---------- */
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    heroVideo.addEventListener("playing", function () {
      heroVideo.classList.add("is-playing");
    });
    heroVideo.addEventListener("error", function () {
      heroVideo.remove();
    });
  }

  /* ---------- 背景视频声音：点击页面任意位置即开启，喇叭按钮可再次切换 ---------- */
  var heroSound = document.getElementById("heroSound");
  var heroSoundWrap = document.getElementById("heroSoundWrap");
  var soundEnabled = false;

  function updateSoundUI(on) {
    if (heroSound) {
      heroSound.classList.toggle("on", on);
      heroSound.setAttribute("title", on ? "关闭背景声音" : "开启背景声音");
      heroSound.setAttribute("aria-label", on ? "关闭背景声音" : "开启背景声音");
    }
    if (heroSoundWrap) heroSoundWrap.classList.toggle("on", on);
  }

  function enableHeroSound() {
    if (soundEnabled || !heroVideo) return;
    soundEnabled = true;
    heroVideo.muted = false;
    heroVideo.play().catch(function () {});
    updateSoundUI(true);
    document.removeEventListener("click", enableHeroSound);
    document.removeEventListener("touchend", enableHeroSound);
  }
  document.addEventListener("click", enableHeroSound);
  document.addEventListener("touchend", enableHeroSound);

  if (heroSound && heroVideo) {
    heroSound.addEventListener("click", function (e) {
      e.stopPropagation(); /* 避免冒泡触发文档级“任意位置”监听造成状态冲突 */
      soundEnabled = true;
      var on = !heroSound.classList.contains("on");
      heroVideo.muted = !on;
      updateSoundUI(on);
      if (on) {
        heroVideo.play().catch(function () {});
      }
      document.removeEventListener("click", enableHeroSound);
      document.removeEventListener("touchend", enableHeroSound);
    });
  }

  /* ---------- 业绩筛选 ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card");
  var tableRows = document.querySelectorAll("#projectTable tbody tr");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      projectCards.forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.classList.toggle("hidden", !show);
        if (show) {
          card.classList.remove("visible");
          void card.offsetWidth; /* 重新触发过渡动画 */
          card.classList.add("visible");
        }
      });
      tableRows.forEach(function (row) {
        var show = f === "all" || row.getAttribute("data-cat") === f;
        row.classList.toggle("hidden", !show);
      });
    });
  });

  /* ---------- 宣传片弹窗 ---------- */
  var videoModal = document.getElementById("videoModal");
  var promoVideo = document.getElementById("promoVideo");
  function openVideo() {
    videoModal.classList.add("open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    promoVideo.play().catch(function () {});
  }
  function closeVideo() {
    videoModal.classList.remove("open");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    promoVideo.pause();
  }
  document.getElementById("openVideo").addEventListener("click", openVideo);
  document.getElementById("videoClose").addEventListener("click", closeVideo);
  document.getElementById("videoMask").addEventListener("click", closeVideo);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && videoModal.classList.contains("open")) closeVideo();
  });

  /* ---------- 证照图片查看器 ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCount = document.getElementById("lightboxCount");
  var certImgs = [];
  document.querySelectorAll("[data-lightbox] img").forEach(function (img) {
    certImgs.push(img);
  });
  var lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = (index + certImgs.length) % certImgs.length;
    lightboxImg.src = certImgs[lightboxIndex].src;
    lightboxCount.textContent = (lightboxIndex + 1) + " / " + certImgs.length;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  certImgs.forEach(function (img, i) {
    img.closest("[data-lightbox]").addEventListener("click", function () {
      openLightbox(i);
    });
  });
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", function (e) {
    e.stopPropagation();
    openLightbox(lightboxIndex - 1);
  });
  document.getElementById("lightboxNext").addEventListener("click", function (e) {
    e.stopPropagation();
    openLightbox(lightboxIndex + 1);
  });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(lightboxIndex - 1);
    if (e.key === "ArrowRight") openLightbox(lightboxIndex + 1);
  });

  /* ---------- 返回顶部 ---------- */
  var backTop = document.getElementById("backTop");
  window.addEventListener("scroll", function () {
    backTop.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });
  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 留言表单（演示提交） ---------- */
  var toast = document.getElementById("toast");
  var toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }
  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("fName").value.trim();
    var phone = document.getElementById("fPhone").value.trim();
    var msg = document.getElementById("fMsg").value.trim();
    if (!name || !phone || !msg) {
      showToast("请完整填写姓名、电话和留言内容");
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      showToast("请输入正确的11位手机号码");
      return;
    }
    showToast("留言已提交，我们将尽快与您联系（演示）");
    e.target.reset();
  });
})();
