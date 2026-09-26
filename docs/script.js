// スクロールで要素をふわっと表示する
const revealTargets = document.querySelectorAll(".reveal, .stickers");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

// スタンプを順番にぴょこっと出す
document.querySelectorAll(".stickers__grid img").forEach((img, i) => {
  img.style.animationDelay = `${i * 60}ms`;
});

// いいね（見た目だけ）
document.querySelectorAll(".post__actions .like").forEach((like) => {
  like.addEventListener("click", () => {
    const liked = like.classList.toggle("is-liked");
    like.textContent = liked ? "♥" : "♡";
  });
});

// タブ：スクロール位置に合わせて下線を移動
const tabs = document.querySelectorAll(".tabs__item");
const sections = [...tabs].map((tab) => document.querySelector(tab.getAttribute("href")));

window.addEventListener(
  "scroll",
  () => {
    let current = 0;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top < window.innerHeight * 0.4) current = i;
    });
    tabs.forEach((tab, i) => tab.classList.toggle("is-active", i === current));
  },
  { passive: true }
);
