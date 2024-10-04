<script>
import UserService from "@/DriveSafe/services/user.service";
import { jwtDecode } from "jwt-decode";

export default {
  computed: {
    items() {
      return [
        { label: this.$t('Menu.home'), to: "/home" },
        { label: this.$t('Menu.search'), to: "/car-search-tenant" },
        { label: this.$t('Menu.maintenance'), to: "/maintenance-tenant" },
        { label: this.$t('Menu.rent'), to: "/rent-tenant" },
      ];
    }
  },
  data(){
    return {
      user: {
        languageOptions: [
          { label: 'EN', value: 'en' },
          { label: 'ES', value: 'es' }
        ],
        selectedLanguage: 'en',
        Name: '',
        LastName: '',
        photo: localStorage.getItem("fotoTenant"),
        Cellphone: '',
        Gmail: ''
      },
      drawer: false,
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async loadTenantInfo() {
      try {
        const token = localStorage.getItem("userToken");
        const decodedToken = jwtDecode(token);

        const userId = decodedToken['Id'];

        const response = await UserService.getUserById(parseInt(userId));
        this.user = response.data;
      } catch (error) {
      }
    },
    logout() {
      this.$router.push('/login');
      localStorage.clear()
    },
  },
  created() {
    this.loadTenantInfo();
  },
};
</script>

<template>
  <pv-toast />
  <header aria-label="Barra de navegación">
    <pv-toolbar class="custom-bg custom-toolbar">
      <template #start>
        <img src="https://i.postimg.cc/2jd7PRtj/Drive-Safe-Logo.png" alt="Logo" style="height: 40px; margin-right: 20px;"/>
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
                aria-label="Botón de navegación"
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-tenant" aria-label="Enlace al perfil del arrendatario">
            <img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="Usuario" style="height: 30px; margin-left: 20px; cursor: pointer;" aria-label="Imagen de perfil del arrendatario"/>
          </router-link>
        </div>
      </template>
    </pv-toolbar>
  </header>
  <body>
  <div class="profile-container" aria-label="Contenedor del perfil del usuario">
    <div class="left-column" aria-label="Columna izquierda del perfil del usuario">
      <div class="title" aria-label="Título del perfil del usuario">
        <h1>{{$t('ProfileTenant.title')}}</h1>
        <h2>{{$t('ProfileTenant.type')}}</h2>
      </div>
      <div class="profile-info" aria-label="Información del perfil del usuario">
        <h2>{{$t('ProfileTenant.name')}}</h2>
        <h2>{{ user.Name }}</h2><br>
        <h2>{{$t('ProfileTenant.last_name')}}</h2>
        <h2>{{ user.LastName }}</h2><br>
        <h2>{{$t('ProfileTenant.phone')}}</h2>
        <h2>{{ user.Cellphone }}</h2><br>
        <h2>{{$t('ProfileTenant.gmail')}} </h2>
        <h2>{{ user.Gmail }}</h2><br>
      </div>
      <div class="buttons" aria-label="Botones del perfil del usuario">
        <router-link to="/update-tenant" aria-label="Enlace para actualizar datos del arrendatario">
          <pv-button class="font-button">{{$t('ProfileTenant.update_button')}}</pv-button><br>
        </router-link>

        <pv-button class="font-button" @click="logout" aria-label="Botón para cerrar sesión">{{$t('ProfileTenant.logout_button')}}</pv-button>
      </div>
    </div>

  </div>
  </body>
</template>


<style scoped>
body{
  font-family: 'Poppins', sans-serif;
  color: #000000; 
  background-color: white;
}
.custom-bg {
  background-color: white;
}
.custom-button, .font-button {
  background-color: #ffffff;
}
.custom-button:hover,
.custom-button:focus {
  background-color: #1A2C63 !important; 
  color: white !important;
}

.custom-toolbar {
  border-bottom: 2px solid #ddd;
}
.profile-button {
  text-align: center;
  margin-top: 10px;
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.font-button {
  margin: 2px 0;
  background-color: #1A2C63;
  color: white;
}

.font-button:hover{
  background-color: #FFA500;
  color: white;
}

.profile-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.left-column {
  flex: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.right-column {
  flex: 10;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title h1{
  margin-top: 0;
}

.size-photo{
  max-width: 50%;
  max-height: 50%;
}

.profile-image-container{
  background-color: #f5f5f5;
  border: 2px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  height: 50%;
}

.profile-info{
  margin-top: 40px;
  margin-bottom: 20px;
}

.profile-info p{
  margin: 10px;
  line-height: 2.5;
}

.profile-image{
  display: flex;
  align-items: center;
  justify-content: center;
}

h2, p {
  display: inline;
  margin: 0;
}
</style>
