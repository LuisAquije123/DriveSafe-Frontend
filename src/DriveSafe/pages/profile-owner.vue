<script>
import UserService from "@/DriveSafe/services/user.service";
import {jwtDecode} from "jwt-decode";
export default {
  computed: {
    items() {
      return [
        { label: this.$t('Menu.home'), to: "/home-owner" },
        { label: this.$t('Menu.register'), to: "/car-registration-owner" },
        { label: this.$t('Menu.notifications'), to: "/notifications" },
        { label: this.$t('Menu.rent'), to: "/rent-owner" },
      ];
    },
  },
  data(){
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      user: {
        Name: '',
        LastName: '',
        photo: localStorage.getItem("fotoOwner"),
        Cellphone: '',
        Gmail: '',
      },
      drawer: false,
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async loadOwnerInfo() {
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
    this.loadOwnerInfo();
  },
};
</script>

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
            >
              {{ item.label }}
            </pv-button>
          </router-link>
          <router-link to="/profile-owner">
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
  <body>
  <div class="profile-container">
    <div class="left-column">
      <div class="title">
        <h1>{{$t('ProfileOwner.title')}}</h1>
        <h2>{{$t('ProfileOwner.type')}}</h2>
      </div>
      <div class="profile-info">
        <h2>{{$t('ProfileOwner.Name')}}: </h2>
        <h2>{{ user.Name }}</h2><br>
        <h2>{{$t('ProfileOwner.LastName')}}</h2>
        <h2>{{ user.LastName }}</h2><br>
        <h2>{{$t('ProfileOwner.Cellphone')}}</h2>
        <h2>{{ user.Cellphone }}</h2><br>
        <h2>{{$t('ProfileOwner.Gmail')}} </h2>
        <h2>{{ user.Gmail }}</h2><br>
      </div>
      <div class="buttons">
        <router-link to="/update-owner">
          <pv-button class="font-button">{{$t('ProfileOwner.update_button')}}</pv-button><br>
        </router-link>
        <pv-button class="font-button" @click="logout">{{$t('ProfileOwner.logout_button')}}</pv-button>
      </div>
    </div>

  </div>
  </body>
</template>


<style scoped>
  
body{
  font-family: 'Poppins', sans-serif;
  color: black;
  background-color: white;
}
.custom-bg {
  background-color: white;
}
.custom-button, .font-button {
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
  background-color: black !important;
  color: white !important;
}

.font-button:hover,
.font-button:focus{
  background-color: #14131B !important;
  color: white !important;
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
