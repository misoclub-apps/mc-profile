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
    like.classList.toggle("is-liked");
  });
});

// タブ：X のように表示を切り替える
const tabs = document.querySelectorAll(".tabs__item");
const panels = document.querySelectorAll(".panel");
const tabBar = document.querySelector(".tabs");

// リンクタブの中身は、ポスト下のリンク一覧を複製して使う
const linksClone = document.querySelector("#links").cloneNode(true);
linksClone.removeAttribute("id");
linksClone.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
document.querySelector("#panel-links").append(linksClone);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("aria-controls");
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active);
    });
    panels.forEach((panel) => (panel.hidden = panel.id !== target));

    // タブより下までスクロールしていたら、タブの位置まで戻す
    const tabTop = tabBar.offsetTop;
    if (window.scrollY > tabTop) window.scrollTo({ top: tabTop });
  });
});

// 投稿下のボタン：押すとちょっとした反応を返す
const popBubble = (el, text) => {
  const bubble = document.createElement("span");
  bubble.className = "bubble";
  bubble.textContent = text;
  el.append(bubble);
  setTimeout(() => bubble.remove(), 1600);
};

const replies = [
  "ありがと〜！😆",
  "DMはXでまってます📩",
  "感想もらえると泣いて喜びます🥹",
  "いい一日を！☀️",
  "アプリ触ってみてね📱",
];

document.querySelectorAll(".post__actions .reply").forEach((btn) => {
  btn.addEventListener("click", () => {
    popBubble(btn, replies[Math.floor(Math.random() * replies.length)]);
  });
});

document.querySelectorAll(".post__actions .repost").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.remove("is-spinning");
    void btn.offsetWidth; // アニメを連打でも再生し直す
    btn.classList.add("is-spinning");
    popBubble(btn, "リポスト！🔁");
  });
});

document.querySelectorAll(".post__actions .share").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const url = location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      popBubble(btn, "URLコピーしたよ📋");
    } catch (e) {
      if (e.name !== "AbortError") popBubble(btn, "シェアしてね🙏");
    }
  });
});
