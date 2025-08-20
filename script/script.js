document.getElementById("closeHeroSlider").addEventListener("click", () => {
  document.getElementById("heroSlider").classList.remove("open");
});

document.getElementById("tryNowBtn").addEventListener("click", () => {
  document.getElementById("heroSlider").classList.add("open");
});

  window.addEventListener("load", () => {
    document.getElementById("loader").classList.add("hidden");
  });