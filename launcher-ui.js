document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".stage-word");
  if (title) title.textContent = "PROJECT NEO";

  const link = document.querySelector(".nav-download");
  if (link) {
    link.replaceChildren(
      document.createTextNode("Get Launcher"),
      Object.assign(document.createElement("span"), {
        className: "nav-download-icon",
        innerHTML: '<img src="./assets/icons/download.svg" alt="">',
      }),
    );
  }

  const heroLabel = document.querySelector(".isle-code-label");
  if (heroLabel) heroLabel.textContent = "Download";
});
