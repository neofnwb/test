document.addEventListener("DOMContentLoaded", () => {
  const downloadTab = document.querySelector('.nav-tabs a[href="https://neofn.dev/creators"]');
  if (downloadTab) {
    downloadTab.href = "https://projectneofn.dev/download";
    downloadTab.textContent = "Download";
  }

  const title = document.querySelector(".stage-word");
  if (title) title.textContent = "PROJECT NEO";

  const link = document.querySelector(".nav-download");
  if (link) {
    link.classList.add("finder");
    link.setAttribute("aria-label", "Get Launcher");
    link.setAttribute("data-edge", "");
    link.setAttribute("data-edge-on-border", "");
    link.setAttribute("data-edge-stroke", "2");
    link.setAttribute("data-edge-glow", "0.35");
    link.replaceChildren(
      Object.assign(document.createElement("span"), {
        className: "finder-glass neo-glass",
      }),
      Object.assign(document.createElement("span"), {
        className: "nav-download-label",
        textContent: "Get Launcher",
      }),
      Object.assign(document.createElement("span"), {
        className: "finder-go nav-download-go",
        innerHTML: '<img src="./assets/icons/download.svg" alt="">',
      }),
    );
    link.firstElementChild.setAttribute("aria-hidden", "true");
    link.lastElementChild.setAttribute("aria-hidden", "true");
    import("./astro/Layout.astro_astro_type_script_index_1_lang.C7SCjpzP.js")
      .then((layout) => layout.j())
      .catch((error) => console.error("Neo: launcher button edge failed to mount.", error));
  }

  const heroLabel = document.querySelector(".isle-code-label");
  if (heroLabel) heroLabel.textContent = "Download";

  const reviewTitle = document.querySelector("#creators-title");
  if (reviewTitle) reviewTitle.textContent = "Player Reviews";

  const reviewCopy = [
    "Season switching is simple, and the old Fortnite feel is spot on.",
    "A quick way to revisit the seasons I grew up playing.",
    "The launcher is easy to use and gets me into a match fast.",
    "Classic maps and weapons make every session feel familiar.",
    "I like how quickly I can pick a season and start playing.",
    "A smooth return to the Fortnite seasons I remember.",
    "Everything is straightforward, from choosing a season to launching.",
    "The old-school atmosphere is exactly what I was looking for.",
    "It is great having several classic seasons in one place.",
    "Simple setup, quick matches, and plenty of nostalgia.",
    "I can jump in with friends without a complicated setup.",
    "The launcher keeps it easy to get back to classic Fortnite.",
    "A fun way to revisit the maps and gameplay I missed.",
    "Picking a season takes seconds, and then we are playing.",
  ];

  const reviewList = document.querySelector("[data-creators]");
  if (reviewList) {
    const updateReviews = () => {
      reviewList.querySelectorAll("[data-creator]").forEach((card, index) => {
        const name = card.querySelector(".creator-name");
        const face = card.querySelector(".creator-face");
        const copy = card.querySelector(".creator-maps");
        const badge = card.querySelector(".creator-rating span");
        if (name) name.textContent = "Neo Player";
        if (face) {
          face.classList.add("creator-face-review");
          face.innerHTML = '<span class="creator-initial">NP</span>';
        }
        if (copy) {
          copy.classList.remove("creator-maps");
          copy.classList.add("creator-review");
          copy.textContent = reviewCopy[index % reviewCopy.length];
        }
        if (badge) badge.textContent = "Player review";
      });
    };

    updateReviews();
    new MutationObserver(updateReviews).observe(reviewList, { childList: true });
  }
});
