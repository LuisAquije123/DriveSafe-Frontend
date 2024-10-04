<template>
  <pv-toast />
  <header>
    <pv-toolbar class="custom-bg custom-toolbar">
      <template #start>
        <img
            src="https://i.postimg.cc/2jd7PRtj/Drive-Safe-Logo.png"
            alt="Logo"
            style="height: 40px; margin-right: 20px;"
        />
        <div class="language-buttons">
          <button class="language-button" @click="switchLanguage" aria-label="Switch Language">
            {{ selectedLanguage === 'en' ? 'ES' : 'EN' }}
          </button>
        </div>
      </template>
      <template #end>
        <div class="flex-column">
          <router-link
              v-for="item in items"
              :to="item.to"
              custom
              v-slot="{ navigate, href }"
              :key="item.label"
          >
            <pv-button
                class="custom-button"
                :href="href"
                @click="navigate"
                aria-label="Navigate"
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-tenant">
            <img
                src="https://i.postimg.cc/Fs9Z3g3V/usuario-1.png"
                alt="Usuario"
                style="height: 30px; margin-left: 20px; cursor: pointer;"
            />
          </router-link>
        </div>
      </template>
    </pv-toolbar>
  </header>
  <div>

    <div class="body-container">
      <img src="../../../public/cuerpo.jpg" alt="Imagen de fondo" class="background-image">

      <div class="floating-card">
        <h1 class="orange-text">{{$t('HomeTenant.title1')}}</h1>
        <h1 class="black-text">{{$t('HomeTenant.title2')}}</h1>

        <div class="input-button-container">
          <div class="input-container">
            <input type="text" id="ubicacion" placeholder="Surco - Lima, Perú">

            <router-link to="/car-search-tenant">
              <button class="search-button" aria-label="Search-vehicle">{{$t('HomeTenant.search_button')}}</button>
            </router-link>

          </div>
        </div>
      </div>
    </div>
    <div class="centered-text">
      <p class="black-text-body">{{$t('HomeTenant.description1')}}</p>
      <p class="orange-text-body">{{$t('HomeTenant.description2')}}</p>
    </div>
    <div class="card-carousel-container">
      <div class="card-carousel">
        <div class="carousel-arrow left-arrow" @click="rotateCarousel(-2)">
          <i class="pi pi-chevron-left"></i>
        </div>
        <div class="carousel-cards">
          <a href="#" class="card-link">
            <div class="card">
              <img src="../../../public/hyundai.jpg" alt="Hyundai">
              <p class="card-title">Hyundai</p>
            </div>
          </a>
          <a href="#" class="card-link">
            <div class="card">
              <img src="../../../public/nissan.jpg" alt="Nissan">
              <p class="card-title">Nissan</p>
            </div>
          </a>
          <a href="#" class="card-link">
            <div class="card">
              <img src="../../../public/toyota.jpg" alt="Toyota">
              <p class="card-title">Toyota</p>
            </div>
          </a>
          <a href="#" class="card-link">
            <div class="card">
              <img src="../../../public/kia.jpg" alt="KIA">
              <p class="card-title">KIA</p>
            </div>
          </a>
          <a href="#" class="card-link hidden-card">
            <div class="card">
              <img src="../../../public/kia.jpg" alt="KIA">
              <p class="card-title">KIA</p>
            </div>
          </a>
          <a href="#" class="card-link hidden-card">
            <div class="card">
              <img src="../../../public/kia.jpg" alt="KIA">
              <p class="card-title">KIA</p>
            </div>
          </a>
          <a href="#" class="card-link hidden-card">
            <div class="card">
              <img src="../../../public/kia.jpg" alt="KIA">
              <p class="card-title">KIA</p>
            </div>
          </a>
          <a href="#" class="card-link hidden-card">
            <div class="card">
              <img src="../../../public/kia.jpg" alt="KIA">
              <p class="card-title">KIA</p>
            </div>
          </a>

        </div>
        <div class="carousel-arrow right-arrow" @click="rotateCarousel(2)">
          <i class="pi pi-chevron-right"></i>
        </div>
      </div>
    </div>
    <RouterView />
  </div>
</template>

<script>
export default{
  name: "HomeTenant",
  computed: {
    items() {
      return [
        { label: this.$t('Menu.home'), to: "/home" },
        { label: this.$t('Menu.search'), to: "/car-search-tenant" },
        { label: this.$t('Menu.maintenance'), to: "/maintenance-tenant" },
        { label: this.$t('Menu.rent'), to: "/rent-tenant" },
      ];
    },
  },
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      cardCount: 4,
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    rotateCarousel(step) {
      const cardContainer = document.querySelector(".carousel-cards");
      const hiddenCards = document.querySelectorAll(".hidden-card");
      const visibleCards = cardContainer.querySelectorAll(".card:not(.hidden-card)");

      const totalVisibleCards = visibleCards.length;
      const totalHiddenCards = hiddenCards.length;

      const newCardCount = this.cardCount + step;

      if (newCardCount >= 1 && newCardCount <= totalVisibleCards + totalHiddenCards) {
        this.cardCount = newCardCount;

        hiddenCards.forEach((card) => {
          card.style.display = "none";
        });

        for (let i = 0; i < this.cardCount; i++) {
          if (visibleCards[i]) {
            visibleCards[i].style.display = "flex";
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.body-container {
  margin: 20px;
  position: relative;
  height: 500px;
}
.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0.9;
}
.floating-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  background-color: white;
  padding: 20px 50px 20px 50px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  border-radius: 15px;

}
.orange-text {
  color: #FF7A00;
  font-size: 50px;
  font-weight: bold;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
}
.black-text {
  color: black;
  font-size: 50px;
  font-weight: bold;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
}
.input-button-container {
  display: flex;
  align-items: center;
}
.input-container {
  display: flex;
  grid-gap: 40px;
  margin-top: 40px;
}
input {
  padding: 10px 40px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px rgba(0, 0, 0, 0.1);
}
.search-button {
  background-color: black;
  color: white;
  padding: 10px 70px 20px 70px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  white-space: nowrap;
}
.black-text-body{
  color: black;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  text-align: center;
  padding: 10px;
}
.orange-text-body{
  color: #FF7A00;
  font-size: 18px;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
  text-align: center;
  padding: 10px;
}

.card-carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding-right: 50px;
  padding-left: 50px;
}
.card-carousel {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.hidden-card{
  display: none;
}
.left-arrow {
  margin-right: 10px;
}
.right-arrow {
  margin-left: 10px;
}
.carousel-cards {
  display: flex;
  overflow-x: hidden;
}
.card {
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  flex: 1;
  max-width: 300px;
  margin:10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
.card img {
  max-height: 70%;
  object-fit: contain;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 20px;
}
.card-title {
  font-size: 16px;
  margin-top: 10px;
  color: black;

}
.card-link {
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  font-weight: bold;
}

</style>
