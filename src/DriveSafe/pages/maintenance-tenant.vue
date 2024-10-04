<script>
import Card from "primevue/card";
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import RentService from "@/DriveSafe/services/rent.service";
import UserService from "@/DriveSafe/services/user.service";
import MaintenanceService from "@/DriveSafe/services/maintenance.service.js";
import Swal from 'sweetalert2'
import {jwtDecode} from "jwt-decode";

export default {
  components: {
    Card,
    Dropdown,
    InputText,
  },
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
      rents: [],
      userOptions: [],
      userOptionsId: [],
      value1: null,
      value2: null,
      value3: null,
      selectedUser: null,
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async obtainOwnerByRent() {
      try {

        const token = localStorage.getItem("userToken");
        const decodedToken = jwtDecode(token);

        const userId = decodedToken['Id'];
        const response = await RentService.getAll();
        this.rents = response.data
        const uniqueOwners = new Set();
        const uniqueIds = new Set();

        for (let rent of this.rents){
          if (rent.TenantId === parseInt(userId) && rent.Status === 'Paid') {
            const userResponse = await UserService.getUserById(rent.OwnerId);
            uniqueOwners.add(`${userResponse.data.Name} ${userResponse.data.LastName}`);
            uniqueIds.add(`${userResponse.data.Id}`)
          }
        }
        this.userOptions = Array.from(uniqueOwners);

        this.userOptionsId = Array.from(uniqueIds);

      } catch (error) {
      }
    },
    async sendRequest() {
      const token = localStorage.getItem("userToken");
      const decodedToken = jwtDecode(token);

      const userId = decodedToken['Id'];

      if (!this.value1 || !this.value2 || !this.value3 || !this.selectedUser) {
        Swal.fire({
          icon: 'error',
          title: this.$t('MaintenanceTenant.incomplete_fields'),
          text: this.$t('MaintenanceTenant.complete_all_fields'),
          confirmButtonText: 'Accept'
        });
        return;
      }
      const selectedUserIndex = this.userOptions.indexOf(this.selectedUser);
      const ownerId = this.userOptionsId[selectedUserIndex];
      const maintenance = {
        TypeProblem: this.value1,
        Title: this.value2,
        Description: this.value3,
        TenantId: parseInt(userId),
        OwnerId: parseInt(ownerId)
      };

      try {
        const response = await MaintenanceService.create(maintenance);
        Swal.fire({
          icon: 'success',
          title: this.$t('MaintenanceTenant.success'),
          text: this.$t('MaintenanceTenant.maintenance_created'),
          confirmButtonText: 'Accept'
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: this.$t('MaintenanceTenant.error'),
          text: this.$t('MaintenanceTenant.maintenance_error'),
          confirmButtonText: 'Accept'
        });
      }
    }
  },
  created() {
    this.obtainOwnerByRent();
  }
};
</script>

<template>
  <pv-toast aria-live="polite" />
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

  <div class="container">
    <div class="half-width-card">
      <Card role="region" aria-labelledby="card1Title">
        <template #title>
          <h1 id="card1Title" style="font-family: 'Poppins',sans-serif; color:#FF7A00">
            {{ $t('MaintenanceTenant.maintenance_form') }}
          </h1>
        </template>
        <template #content>
          <p style="font-family: 'Poppins',sans-serif">
            {{ $t('MaintenanceTenant.text1') }}
          </p>
          <p style="font-family: 'Poppins',sans-serif; color:#FF7A00">
            {{ $t('MaintenanceTenant.text2') }}
          </p>
        </template>
      </Card>
    </div>
    <div class="half-width-card">
      <Card role="form" aria-labelledby="card2Title">
        <template #title>
          <h2 id="card2Title" style="font-family: 'Poppins',sans-serif">
            {{ $t('MaintenanceTenant.title') }}
          </h2>
        </template>
        <template #content>
          <p style="font-family: 'Poppins',sans-serif">
            {{$t('MaintenanceTenant.select_owner')}}
          </p>
          <Dropdown
              :options="userOptions"
              v-model="selectedUser"
              :placeholder="$t('MaintenanceTenant.select_owner')"
              role="combobox"
              aria-expanded="false"
          />
          <Card role="region" aria-labelledby="card3Title">
            <template #title></template>
            <template #content>
              <p style="font-family: 'Poppins',sans-serif">{{ $t('MaintenanceTenant.problem_type') }}</p>
              <InputText v-model="value1" :placeholder="$t('MaintenanceTenant.problem_type')" style="font-family: 'Poppins',sans-serif" role="textbox"/>
              <p style="font-family: 'Poppins',sans-serif">{{ $t('MaintenanceTenant.title') }}</p>
              <InputText v-model="value2" :placeholder="$t('MaintenanceTenant.title')" style="font-family: 'Poppins',sans-serif" role="textbox"/>
              <p style="font-family: 'Poppins',sans-serif">{{ $t('MaintenanceTenant.description') }}</p>
              <InputText v-model="value3" :placeholder="$t('MaintenanceTenant.description')" style="font-family: 'Poppins',sans-serif" role="textbox"/>

              <div class="button-container">
                <Button class="custom-button3">{{ $t('MaintenanceTenant.add_photos') }}</Button>
                <Button class="custom-button3" @click="sendRequest">{{ $t('MaintenanceTenant.send') }}</Button>
              </div>
            </template>
          </Card>
        </template>
      </Card>
    </div>
  </div>
</template>


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

.button-container {
  display: block;
  margin-top: 10px;
}

.custom-button3 {
  height: 30px;
  margin: 20px;
  background-color: black;
  color: white;
  font-family: 'Poppins', sans-serif;
  border: none;
  min-width: auto;
}

</style>
