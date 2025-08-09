// Hareketli arka planı oluştur
function createGalaxy() {
  const galaxy = document.getElementById("galaxy");

  // Yıldızları oluştur
  for (let i = 0; i < 200; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.width = `${Math.random() * 2 + 1}px`;
    star.style.height = star.style.width;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.opacity = Math.random() * 0.8 + 0.2;
    star.style.setProperty("--duration", `${Math.random() * 10 + 5}s`);
    galaxy.appendChild(star);
  }

  // Kayan yıldızları oluştur
  for (let i = 0; i < 10; i++) {
    const shootingStar = document.createElement("div");
    shootingStar.classList.add("shooting-star");
    shootingStar.style.left = "0";
    shootingStar.style.top = "0";
    shootingStar.style.width = `${Math.random() * 100 + 50}px`;
    shootingStar.style.setProperty("--y", `${Math.random() * 100}vh`);
    shootingStar.style.setProperty("--duration", `${Math.random() * 10 + 15}s`);
    shootingStar.style.animationDelay = `${Math.random() * 10}s`;
    galaxy.appendChild(shootingStar);
  }

  // Nebulaları oluştur
  for (let i = 0; i < 5; i++) {
    const nebula = document.createElement("div");
    nebula.classList.add("nebula");
    nebula.style.width = `${Math.random() * 300 + 100}px`;
    nebula.style.height = nebula.style.width;
    nebula.style.left = `${Math.random() * 100}%`;
    nebula.style.top = `${Math.random() * 100}%`;
    nebula.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
    nebula.style.setProperty("--duration", `${Math.random() * 20 + 10}s`);
    galaxy.appendChild(nebula);
  }
}

// Hareketli parçacıklar oluştur
function createParticles() {
  const particlesContainer = document.createElement("div");
  particlesContainer.id = "particles-container";
  particlesContainer.style.position = "fixed";
  particlesContainer.style.top = "0";
  particlesContainer.style.left = "0";
  particlesContainer.style.width = "100%";
  particlesContainer.style.height = "100%";
  particlesContainer.style.pointerEvents = "none";
  particlesContainer.style.zIndex = "-1";
  document.body.appendChild(particlesContainer);

  setInterval(() => {
    if (document.querySelectorAll(".particle").length > 100) return;

    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.width = `${Math.random() * 10 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = "100%";
    particle.style.opacity = Math.random() * 0.5 + 0.1;

    const animationDuration = Math.random() * 10 + 5;
    particle.style.animation = `float ${animationDuration}s linear`;
    particle.style.setProperty("--distance", `${Math.random() * 100 - 50}vw`);

    particlesContainer.appendChild(particle);

    // Parçacığı kaldır
    setTimeout(() => {
      particle.remove();
    }, animationDuration * 1000);
  }, 300);
}

// Parçacık animasyonu için CSS ekle
const style = document.createElement("style");
style.textContent = `
            @keyframes float {
                to {
                    transform: translateY(calc(-100vh - 100px)) translateX(var(--distance));
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);

// Uygulama başlatıldığında
document.addEventListener("DOMContentLoaded", () => {
  createGalaxy();
  createParticles();

  // JSON verisini yükle
  let tarotData;
  fetch("tarotCards.json")
    .then((response) => response.json())
    .then((data) => {
      tarotData = data;
      // Sayfa yüklendiğinde bir kart çek
      drawRandomCard();
    })
    .catch((error) => {
      console.error("JSON yüklenirken hata oluştu:", error);
      // Hata durumunda placeholder kartı göster
      currentCard = {
        id: "13",
        name: "Death",
        tr_name: "Ölüm",
        image_url:
          "https://via.placeholder.com/300x500/2c3e50/ffffff?text=Tarot+Kartı",
        keywords: {
          upright: ["son", "değişim", "dönüşüm", "geçiş"],
          reversed: ["direnç", "durgunluk", "korku", "ölümden korkma"],
        },
        arcana: "major",
        element: "Su",
        astrology: "Akrep",
      };
      isReversed = false;
      displayCard();
    });

  // Uygulama durumu
  let currentCard = null;
  let isReversed = false;
  let showEnglish = false;

  // DOM Elementleri
  const cardImage = document.getElementById("cardImage");
  const cardTitle = document.getElementById("cardTitle");
  const cardDescription = document.getElementById("cardDescription");
  const uprightKeywords = document.getElementById("uprightKeywords");
  const reversedKeywords = document.getElementById("reversedKeywords");
  const cardArcana = document.getElementById("cardArcana");
  const cardElement = document.getElementById("cardElement");
  const cardAstrology = document.getElementById("cardAstrology");
  const orientationBadge = document.getElementById("orientationBadge");
  const drawCardBtn = document.getElementById("drawCardBtn");
  const languageBtn = document.getElementById("languageBtn");
  const showListBtn = document.getElementById("showListBtn");
  const cardList = document.getElementById("cardList");
  const cardListContent = document.getElementById("cardListContent");
  const flipCardBtn = document.getElementById("flipCardBtn");

  // Tüm kartları birleştiren fonksiyon
  function getAllCards() {
    if (!tarotData) return [];

    const major = tarotData.tarot_deck.major_arcana;
    const minor = tarotData.tarot_deck.minor_arcana;

    return [
      ...major,
      ...minor.cups,
      ...minor.swords,
      ...minor.wands,
      ...minor.pentacles,
    ];
  }

  // Rastgele kart çekme
  function drawRandomCard() {
    const allCards = getAllCards();
    if (allCards.length === 0) return;

    const randomIndex = Math.floor(Math.random() * allCards.length);
    currentCard = allCards[randomIndex];
    isReversed = Math.random() > 0.7; // %30 ters çıkma olasılığı

    displayCard();
  }

  // Kart görselini döndürme
  function rotateCardImage() {
    if (isReversed) {
      cardImage.classList.add("reversed");
    } else {
      cardImage.classList.remove("reversed");
    }
  }

  // Kartı görüntüleme
  function displayCard() {
    if (!currentCard) return;

    // Kart görseli
    cardImage.src = currentCard.image_url;
    rotateCardImage();

    // Kart başlığı
    const idPrefix = `${currentCard.id}. `;
    cardTitle.textContent =
      idPrefix + (showEnglish ? currentCard.name : currentCard.tr_name);

    // Anahtar kelimeler
    uprightKeywords.textContent = `${
      showEnglish ? "Düz:" : "Düz:"
    } ${currentCard.keywords.upright.join(", ")}`;
    reversedKeywords.textContent = `${
      showEnglish ? "Ters:" : "Ters:"
    } ${currentCard.keywords.reversed.join(", ")}`;

    // Kart bilgileri
    if (currentCard.arcana === "major") {
      cardArcana.textContent = showEnglish ? "Major Arcana" : "Arkana Majör";
    } else {
      const suitNames = {
        cups: showEnglish ? "Cups" : "Kupa",
        swords: showEnglish ? "Swords" : "Kılıç",
        wands: showEnglish ? "Wands" : "Asa",
        pentacles: showEnglish ? "Pentacles" : "Para",
      };
      cardArcana.textContent = `${
        showEnglish ? "Minor Arcana" : "Arkana Minör"
      } - ${suitNames[currentCard.suit]}`;
    }

    cardElement.textContent = `${showEnglish ? "Element:" : "Element:"} ${
      currentCard.element
    }`;
    cardAstrology.textContent = `${showEnglish ? "Astrology:" : "Astroloji:"} ${
      currentCard.astrology || "-"
    }`;

    // Yön bilgisi
    if (isReversed) {
      orientationBadge.textContent = showEnglish ? "REVERSED" : "TERS";
      orientationBadge.className = "orientation-badge reversed";
    } else {
      orientationBadge.textContent = showEnglish ? "UPRIGHT" : "DÜZ";
      orientationBadge.className = "orientation-badge upright";
    }

    // Açıklama
    if (isReversed) {
      cardDescription.textContent = showEnglish
        ? `The reversed ${
            currentCard.name
          } card indicates ${currentCard.keywords.reversed.join(", ")}.`
        : `Ters çıkan ${
            currentCard.tr_name
          } kartı, ${currentCard.keywords.reversed.join(
            ", "
          )} anlamlarına gelebilir.`;
    } else {
      cardDescription.textContent = showEnglish
        ? `The ${
            currentCard.name
          } card represents ${currentCard.keywords.upright.join(", ")}.`
        : `${currentCard.tr_name} kartı, ${currentCard.keywords.upright.join(
            ", "
          )} anlamlarına gelir.`;
    }
  }

  // Kart listesini oluştur
  function generateCardList() {
    const allCards = getAllCards();
    if (allCards.length === 0) return;

    cardListContent.innerHTML = "";

    allCards.forEach((card) => {
      const colDiv = document.createElement("div");
      colDiv.className = "col-12 col-md-6 col-lg-4 mb-3";

      const listItem = document.createElement("div");
      listItem.className = "card-list-item";
      listItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${card.tr_name}</strong> 
                    <span class="ms-2 text-muted">${
                      showEnglish ? card.name : ""
                    }</span>
                </div>
                <div class="badge ${
                  card.arcana === "major" ? "bg-primary" : "bg-info"
                }">
                    ${
                      card.arcana === "major"
                        ? showEnglish
                          ? "Major"
                          : "Majör"
                        : showEnglish
                        ? "Minor"
                        : "Minör"
                    }
                </div>
            </div>
        `;

      listItem.addEventListener("click", () => {
        currentCard = card;
        isReversed = false;
        displayCard();
        cardList.style.display = "none";
      });

      colDiv.appendChild(listItem);
      cardListContent.appendChild(colDiv);
    });
  }

  // Olay dinleyicileri
  drawCardBtn.addEventListener("click", drawRandomCard);

  languageBtn.addEventListener("click", () => {
    showEnglish = !showEnglish;
    languageBtn.textContent = showEnglish ? "Language: EN" : "Dil: TR";
    if (currentCard) displayCard();
  });

  showListBtn.addEventListener("click", () => {
    if (cardList.style.display === "block") {
      cardList.style.display = "none";
    } else {
      generateCardList();
      cardList.style.display = "block";
    }
  });

  flipCardBtn.addEventListener("click", () => {
    if (!currentCard) return;
    isReversed = !isReversed;
    displayCard();
  });
});
