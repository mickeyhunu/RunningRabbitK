function setDefaultVisitTime() {
  const pad = (value) => value.toString().padStart(2, "0");
  const input = document.getElementById("field--time");
  if (!input) return;

  try {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(23, 30, 0, 0);

    const value = [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
    ].join("-") + `T23:30`;

    input.value = value;

    if (!input.value) {
      throw new Error("Datetime format not supported");
    }
  } catch (error) {
    input.value = "2025-12-20T23:30";
  }
}

function renderKakaoMap() {
  if (window.daum?.roughmap?.Lander) {
    new daum.roughmap.Lander({
      timestamp: "1738417653712",
      key: "2mwhj",
      mapWidth: "100%",
      mapHeight: "auto",
    }).render();
  }
}

function myConfetti() {
  if (typeof confetti !== "function") return;

  const end = Date.now() + 5000;
  const colors = ["#FF1903", "##857eff"];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 40,
      origin: { x: 0 },
      colors,
    });

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 40,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function formatAndDisplayTotal(sum) {
  const formatted = new Intl.NumberFormat().format(sum);
  const addValue = document.querySelector(".hack45-added-value");
  const sendValue = document.querySelector(".hack45-send-value");

  if (addValue) addValue.textContent = formatted;
  if (sendValue) sendValue.value = formatted;
}

function calculateTotal() {
  if (typeof $ !== "function") return;

  let sum = 0;
  const visitValue = Number($("input[name=\"Hours\"]:checked").attr("add-value")) || 0;

  let usageTime = 0;
  let whiskeyCount = 0;
  let hostessCount = 0;
  let dancerCount = 0;

  $(".hack44-select").each((_, select) => {
    const value = Number($(select).attr($(select).val())) || 0;
    const name = $(select).attr("name");

    if (name === "usageTime") usageTime = value;
    if (name === "whiskeyCount") whiskeyCount = value;
    if (name === "hostessCount") hostessCount = value;
    if (name === "dancerCount") dancerCount = value;
  });

  sum += visitValue * whiskeyCount; // 주대
  sum += hostessCount * usageTime * 130000; // 아가씨
  sum += dancerCount * usageTime * 60000; // 선수
  sum += 50000; // 웨이터팁 고정

  formatAndDisplayTotal(sum);
}

function bindPricingEvents() {
  if (typeof $ !== "function") return;

  $("input[name=\"Hours\"]").on("change", calculateTotal);
  $(".hack44-select").on("change", calculateTotal);
}

document.addEventListener("DOMContentLoaded", () => {
  setDefaultVisitTime();
  renderKakaoMap();
  bindPricingEvents();
  calculateTotal();
  myConfetti();
});
