document.addEventListener("DOMContentLoaded", () => {
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
});
