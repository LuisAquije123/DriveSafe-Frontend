<script>
import Card from "primevue/card";
import VehicleService from "@/DriveSafe/services/vehicle.service";
import RentService from "@/DriveSafe/services/rent.service";
import UserService from "@/DriveSafe/services/user.service";
import router from "@/router";
import {jwtDecode} from "jwt-decode";
import FileService from "@/DriveSafe/services/file.service";

export default {
  components: {
    Card
  },
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
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      rents: [],
      fileService: FileService
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async loadRents() {
      try {
        const token = localStorage.getItem("userToken");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken['Id'];

        const response = await RentService.getByUserId(userId);
        this.rents = response.data;


        for (const rent of this.rents) {
          const response = await VehicleService.getById(rent.VehicleId);
          rent.Vehicle = response.data;

          const response2 = await UserService.getUserById(rent.OwnerId);

          rent.Owner = response2.data;
        }
      } catch (error) {
      }
    },
    pay(rent) {
      localStorage.setItem("alquilerId", rent.Id)
      localStorage.setItem("vehiculoId", rent.VehicleId)
      localStorage.setItem("vehiculoPrecio", rent.Vehicle.RentalCost)
      localStorage.setItem("vehiculoTiempo", rent.Vehicle.TimeType)
      localStorage.setItem("vehiculoFi", rent.StartDate)
      localStorage.setItem("vehiculoFf", rent.EndDate)
      localStorage.setItem("vehiculoLugar", rent.Vehicle.PickUpPlace)
      localStorage.setItem("vehiculoLugar", rent.Vehicle.PickUpPlace)
      localStorage.setItem("vehiculoLugar", rent.Vehicle.PickUpPlace)
      localStorage.setItem("vehiculoFoto", rent.Vehicle.UrlImage)
      this.$router.push('/rent-payment');
    }
  },
  created() {
    this.loadRents();
  },
};
</script>

<template>
  <div>
    <header>
      <pv-toolbar class="custom-bg custom-toolbar">
        <template #start>
          <img src="https://i.postimg.cc/2jd7PRtj/Drive-Safe-Logo.png" alt="Logo" style="height: 40px; margin-right: 20px;" />
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
              <pv-button class="custom-button" :href="href" @click="navigate">{{ item.label }}</pv-button>
            </router-link>
            <router-link to="/profile-tenant">
              <img src="https://i.postimg.cc/Fs9Z3g3V/usuario-1.png" alt="Usuario" style="height: 30px; margin-left: 20px; cursor: pointer;" />
            </router-link>
          </div>
        </template>
      </pv-toolbar>
    </header>

    <div class="p-grid">
      <h1 style="font-family: 'Poppins', sans-serif; color: #FF7A00">{{ $t('RentTenant.title') }}</h1>
      <div v-if="rents.length === 0">
        <p>{{ $t('RentTenant.no_rents') }}</p>
      </div>
      <div v-else>
        <pv-card v-for="rent in rents" :key="rent.Id" class="vehicle-card">
          <template #title>
            <h2>{{ $t('RentTenant.rent_details') }}</h2>
          </template>
          <template #content>
            <p>{{ $t('RentTenant.brand') }}  {{ rent.Vehicle ? rent.Vehicle.Brand : 'No disponible' }}</p>
            <p>{{ $t('RentTenant.model') }}  {{ rent.Vehicle ? rent.Vehicle.Model : 'No disponible' }}</p>
            <p>{{ $t('RentTenant.owner') }} {{ rent.Owner ? rent.Owner.Name + " " + rent.Owner.LastName : 'No disponible' }}</p>
            <p>{{ $t('RentTenant.phone') }} {{ rent.Owner ? rent.Owner.Cellphone : 'No disponible' }}</p>
            <p>{{ $t('RentTenant.start_date') }} {{ rent.StartDate }}</p>
            <p>{{ $t('RentTenant.end_date') }} {{ rent.EndDate }}</p>
            <p>{{ $t('RentTenant.pick_up_place') }} {{ rent.Vehicle ? rent.Vehicle.PickUpPlace : 'No disponible'}}</p>
            <div v-if="rent.Status.toLowerCase() === 'accepted'"> <h3>{{ $t('RentTenant.status_accepted') }}</h3></div>
            <div v-if="rent.Status === 'Pending'"> <h3>{{ $t('RentTenant.status_pending') }}</h3></div>
            <pv-button v-if="rent.Status === 'Accepted'" @click="pay(rent)" class="pay-button">{{ $t('RentTenant.pay_button') }}</pv-button>            <div v-if="rent.Status === 'Refused'"> <h3>{{ $t('RentTenant.status_refused') }}</h3></div>
            <div v-if="rent.Status === 'Paid'"><h3>{{ $t('RentTenant.status_paid') }}</h3></div>
          </template>
        </pv-card>
      </div>
    </div>
  </div>
</template>

<style>
.pay-button {
  background-color: #1A2C63;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.pay-button:hover {
  background-color: #FF7A00; /* Cambiar el color de fondo cuando se pasa el mouse sobre el botón */
}
.custom-bg {
  background-color: #FFFFFF;
}
.custom-button {
  background-color: #FFFFFF;
  color: #000000;
}
.custom-button:hover,
.custom-button:focus {
  background-color: #FF7A00 !important;
  color: #FFFFFF !important;
}
</style>