<script>
import Swal from 'sweetalert2';
import UserService from "@/DriveSafe/services/user.service";
import {jwtDecode} from "jwt-decode";
export default {
  computed:{
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
      Name: '',
      LastName: '',
      Cellphone: '',
      day: '',
      month: '',
      year: '',
      Password: '',
      Gmail: ''
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async updateTenantData() {
      if (!this.Name || !this.LastName || !this.Cellphone || !this.Password || !this.Gmail || !this.day || !this.month || !this.year) {
        Swal.fire({
          icon: 'warning',
          title: this.$t('ProfileTenant.alerts.title2'),
          text: this.$t('ProfileTenant.alerts.incomplete_fields'),
        });
        return;
      }
      try {
        const token = localStorage.getItem("userToken");
        const decodedToken = jwtDecode(token);

        const userId = decodedToken['Id'];
        const response = await UserService.getUserById(parseInt(userId));

        const responseUser = response.data;
        const BirthdateFormatted = `${this.year}-${String(this.month).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`;
        responseUser.Name = this.Name;
        responseUser.LastName = this.LastName;
        responseUser.Birthdate = BirthdateFormatted;
        responseUser.Cellphone = this.Cellphone;
        responseUser.Gmail = this.Gmail;
        responseUser.Password = this.Password;
        const responseUpdate = await UserService.update(parseInt(userId), responseUser);
        if (responseUpdate.status === 200) {
          Swal.fire({
            icon: 'success',
            title: this.$t('ProfileTenant.alerts.title'),
            text: this.$t('ProfileTenant.alerts.update_success'),
          });
          this.$router.push('/profile-tenant');
        } else {
          throw new Error("La actualización de datos del usuario falló.");
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.$t('ProfileTenant.alerts.update_error'),
        });
      }
    }
  }
};
</script>

<template>
  <pv-toast aria-live="polite" />
  <header role="banner">
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
        <nav class="flex-column">
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
                role="link"
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
        </nav>
      </template>
    </pv-toolbar>
  </header>
  <main class="center-container" style="margin-top: 100px;">
    <h1 id="updateTitle" style="color: #FF7A00;">{{$t('ProfileTenant.update')}}</h1>
    <h2>{{ $t('ProfileTenant.labels.name') }}</h2><br>
    <pv-input :placeholder="$t('ProfileTenant.labels.name')" v-model="Name" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>{{ $t('ProfileTenant.labels.last_name') }}</h2><br>
    <pv-input :placeholder="$t('ProfileTenant.labels.last_name')" v-model="LastName" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>{{ $t('ProfileTenant.labels.cellphone') }}</h2><br>
    <pv-input :placeholder="$t('ProfileTenant.labels.cellphone')" v-model="Cellphone" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input><br>
    <h2>{{ $t('ProfileTenant.labels.birthdate') }}</h2><br>
    <div class="date-inputs">
      <pv-input-text id="day" type="number" :placeholder="$t('ProfileTenant.placeholders.day')" class="date-input" v-model="day" />
      <pv-input-text id="month" type="number" :placeholder="$t('ProfileTenant.placeholders.month')" class="date-input" v-model="month" />
      <pv-input-text id="year" type="number" :placeholder="$t('ProfileTenant.placeholders.year')" class="date-input" v-model="year" />
    </div>
    <h2>{{ $t('ProfileTenant.labels.password') }}</h2><br>
    <pv-input :placeholder="$t('ProfileTenant.placeholders.password')" v-model="Password" type="password" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input>
    <br>
    <h2>{{ $t('ProfileTenant.labels.gmail') }}</h2><br>
    <pv-input :placeholder="$t('ProfileTenant.placeholders.gmail')" v-model="Gmail" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input>
    <br>

    <Button label="$t('ProfileTenant.update_button')" class="custom-button2" @click="updateTenantData()" role="button">{{$t('ProfileTenant.update_button')}}</Button>
  </main>
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
.custom-button{
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

.title h1{
  margin-top: 0;
}

.profile-info p{
  margin: 10px;
  line-height: 2.5;
}

h2, p {
  display: inline;
  margin: 0;
}

.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
}

.date-inputs {
  display: flex;
  justify-content: space-between;
}

.date-input {
  flex: 1;
  margin-right: 10px;
}

.date-input:last-child {
  margin-right: 0;
}

@media (max-width: 600px) {
  .date-inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .date-input {
    margin-right: 0;
    margin-bottom: 10px;
    width: 100%;
  }

  .date-input:last-child {
    margin-bottom: 0;
  }
}
</style>
