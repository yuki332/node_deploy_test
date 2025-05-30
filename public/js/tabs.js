// ここからコードを書いてください
export function setupTabs() {
    const homeTab = document.querySelector("[data-tab='home']");
    const converterTab = document.querySelector("[data-tab='converter']");
    const homeSection = document.querySelector("#home");
    const converterSection = document.querySelector("#converter");

    homeTab.addEventListener("click", () => {
        converterSection.classList.add("hidden");
        homeSection.classList.remove("hidden");
    });
    converterTab.addEventListener("click", () => {
        homeSection.classList.add("hidden");
        converterSection.classList.remove("hidden");
    });
}
