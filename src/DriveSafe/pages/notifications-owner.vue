<script>
import VehicleService from "@/DriveSafe/services/vehicle.service";
import UserService from "@/DriveSafe/services/user.service";
import {useRouter} from "vue-router";
import MaintenanceService from "@/DriveSafe/services/maintenance.service";
import RentService from "@/DriveSafe/services/rent.service";
import {jwtDecode} from "jwt-decode";
import FileService from "@/DriveSafe/services/file.service";

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
  name: "NotificationsOwner",
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      rents: [],
      tenant_id: null,
      maintenances: [],
      router: useRouter(),
      fileService: FileService
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    seeRequest(rent_id){
      localStorage.setItem("alquilerId", rent_id);
      this.router.push('/read-request');
    },
    async loadMaintenances() {
      try {
        const token = localStorage.getItem("userToken");
        const decodedToken = jwtDecode(token);

        const userId = decodedToken['Id'];
        const response = await MaintenanceService.getAll();
        const maintenancesFiltered = response.data.filter(m => m.OwnerId === parseInt(userId));

        const maintenances = [];

        for (let maintenance of maintenancesFiltered) {
          const maintenanceId = maintenance.Id;
          const userResponse = await UserService.getUserById(maintenance.TenantId);
          const name = userResponse.data.Name;
          const last_name = userResponse.data.LastName;
          const description = maintenance.Description;
          const title = maintenance.Title;
          const type_problem = maintenance.TypeProblem;
          maintenances.push({
            Id: maintenanceId,
            Name: name,
            LastName: last_name,
            TypeProblem: type_problem,
            Title: title,
            Description: description
          });
        }
        this.maintenances = maintenances;
      } catch(error){
      }
    },
    async loadRents() {
      try {
        const token = localStorage.getItem("userToken");
        const decodedToken = jwtDecode(token);

        const userId = decodedToken['Id'];

        const response = await RentService.getAll();
        const rentsFiltered = response.data.filter(r => r.OwnerId === parseInt(userId));
        for (let rent of rentsFiltered) {
          const userResponse = await UserService.getUserById(rent.TenantId);
          const vehicleResponse = await VehicleService.getById(rent.VehicleId);
          rent.tenant_name = `${userResponse.data.Name} ${userResponse.data.LastName}`;
          rent.vehicle_brand = vehicleResponse.data.Brand;
          rent.vehicle_model = vehicleResponse.data.Model;
          rent.vehicle_image = vehicleResponse.data.UrlImage;
        }
        this.rents = rentsFiltered;
      } catch (error) {
      }
    },
  },
  created() {
    const token = localStorage.getItem("userToken");
    const decodedToken = jwtDecode(token);

    const userId = decodedToken['Id'];
    this.loadRents();
    this.loadMaintenances();
  }
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
  <div class="notifications-section">
    <h2 class="section-title">{{ $t('NotificationsOwner.title1') }}</h2>
    <div v-if="rents.length === 0" class="notification-card">
      <p class="notification">{{ $t('NotificationsOwner.no_rentals') }}</p>
    </div>
    <div v-for="rent in rents" :key="rent.Id" class="notification-card">
      <div class="notification-content">
        <div class="notification-text">
          <p>{{ rent.tenant_name }} {{ $t('NotificationsOwner.rental_request') }} {{ rent.vehicle_brand }} {{ rent.vehicle_model }}</p>
          <pv-button @click="seeRequest(rent.Id)" class="font-button">{{ $t('NotificationsOwner.see_rental') }}</pv-button><br>
        </div>
        <div class="notification-actions">
          <img :src="fileService.APIGET + rent.vehicle_image" alt="Imagen del vehículo" class="vehiculo-image" />
        </div>
      </div>
    </div>
    <div v-if="maintenances.length === 0" class="notification-card">
      <p class="notification">{{ $t('NotificationsOwner.no_maintenances') }}</p>
    </div>
    <div v-for="maintenance in maintenances" :key="maintenance.id" class="notification-card">
      <div class="notification-content">
        <div class="notification-text">
          <h1>{{ maintenance.Name }} {{ maintenance.LastName }}</h1>
          <h1>{{ $t('NotificationsOwner.type_problem') }}: {{ maintenance.TypeProblem }}</h1>
          <h1>{{ $t('NotificationsOwner.title2') }}: {{ maintenance.Title }}</h1>
          <h1>{{ $t('NotificationsOwner.description') }}: {{ maintenance.Description }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.notifications-section {
  display: grid;
  grid-template-rows: 1fr;
  background-color: white;
  padding: 1px 30px 30px 30px;
  margin-top: 20px;
  font-family: 'Poppins', sans-serif;
}

.section-title {
  margin-top: 90px;
  font-size: 35px;
  font-weight: bold;
  color: #FF7A00;
}

.notification-card {
  padding: 20px;
  margin-top: 10px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fafafa;
  margin-bottom: 5px;
}

.notification-card p {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 130px);
  font-weight: bold;
  padding-left: 30px;
  font-size: 18px;
}

.vehiculo-image {
  max-width: 100px;
  height: auto;
  margin-right: 20px;
}

.view-request-button {
  background-color: #FF7A00;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-request-button:hover {
  background-color: #FF6000;
}

.notification-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-wrap: wrap;
}
</style>