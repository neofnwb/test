document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".stage-word");
  if (title) title.textContent = "PROJECT NEO";

  const link = document.querySelector(".nav-download");
  if (link) {
    link.classList.add("finder");
    link.setAttribute("aria-label", "Get Launcher");
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
  }

  const heroLabel = document.querySelector(".isle-code-label");
  if (heroLabel) heroLabel.textContent = "Download";
});
