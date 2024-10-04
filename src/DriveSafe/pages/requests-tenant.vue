<script>
export default {
  data(){
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      car_description: {
        model: 'Model of the car',
        photo: 'https://www.eluniverso.com/resizer/5bKMqfWuwvNMEEztHyexd0M4L04=/arc-anglerfish-arc2-prod-eluniverso/public/CIXMWPJK5RDV5G3BHZ6QW5GCPM.jpg',
        status: 'EN ESPERA'
      },
      items: [
        { label: "Inicio", to: "/home" },
        { label: "Buscar Autos", to: "/car-search-tenant" },
        { label: "Mantenimiento", to: "/maintenance-tenant" },
        { label: "Alquiler", to: "/rent-tenant" },
        { label: 'Solicitudes', to: '/requests-tenant'},
      ],
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
  }
};
</script>

<template>
  <pv-toast aria-live="polite" />
  <header>
    <pv-toolbar class="custom-bg custom-toolbar" role="banner">
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
        <div class="flex-column" role="navigation">
          <router-link
              v-for="item in items"
              :to="item.to"
              custom
              v-slot="{ navigate, href }"
              :key="item.label"
              role="menuitem"
          >
            <pv-button
                class="custom-button"
                :href="href"
                @click="navigate"
                role="button"
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-tenant" role="menuitem">
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
  <body role="main">
  <div class="title">
    <h1 id="requestsTitle">Solicitudes</h1><br>
  </div>
  <div class="request-container" role="region" aria-labelledby="requestsTitle">
    <div class="left-info">
      <h3>Solicitud de alquiler del vehículo {{car_description.model}}</h3>
    </div>
    <div class="right-info">
      <div class="image-car">
        <img :src="car_description.photo" alt="Imagen" class="size-photo" />
      </div>
      <div class="status-car">
        <h4><b>ESTATUS: {{car_description.status}}</b></h4>
      </div>
    </div>
  </div>
  </body>
</template>

<style scoped>
.custom-bg {
  background-color: white;
}

.custom-button {
  background-color: white;
  color: #14131B;
}

.custom-button:hover,
.custom-button:focus {
  background-color: #FF7A00 !important;
  color: white !important;
}

.custom-toolbar {
  border-bottom: 2px solid #ddd;
}

.size-photo {
  max-width: 50%;
  max-height: 50%;
  border-radius: 10px;
}

.request-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 0 100px;
}

.left-info {
  flex: 1;
  text-align: left;
  margin-left: 8%;

}

.right-info {
  flex: 1;
  text-align: right;
  margin-right: 10%;
}

.image-car{
  flex: 1;
  text-align: right;
  margin-right: 25%;
}

.status-car{
  flex: 1;
  text-align: right;
  margin-right: 30%;
}

img {
  max-width: 100%;
  max-height: 100%;
}

body{
  font-family: 'Poppins', sans-serif;
  color: black;
  background-color: white;
}

.title{
  margin-top: 0;
  margin-left: 4%;
  color: #FF7A00 !important;
}
</style>
