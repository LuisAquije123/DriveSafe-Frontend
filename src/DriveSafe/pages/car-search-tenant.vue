<script>
import Card from "primevue/card";
import Carousel from "primevue/carousel";
import InputText from "primevue/inputtext";
import VehicleService from "@/DriveSafe/services/vehicle.service";
import { useRouter } from "vue-router";
import FileService from "@/DriveSafe/services/file.service";

export default {
  components: {
    Card,
    Carousel,
    InputText,
  },
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      router: useRouter(),
      cardCount: 6,
      vehicles: [],
      TimeType: null,
      Brand: null,
      Model: null,
      CarClass: null,
      Transmission: null,
      RentalCost: null,
      fileService: FileService
    };
  },
  computed: {
    items() {
      return [
        { label: this.$t('Menu.home'), to: "/home" },
        { label: this.$t('Menu.search'), to: "/car-search-tenant" },
        { label: this.$t('Menu.maintenance'), to: "/maintenance-tenant" },
        { label: this.$t('Menu.rent'), to: "/rent-tenant" },
      ];
    },
    availableVehicles() {
      if (
          !this.TimeType &&
          !this.Brand &&
          !this.Model &&
          !this.CarClass &&
          !this.Transmission &&
          !this.RentalCost
      ) {
        return this.vehicles.filter(
            (v) => v.RentStatus.toLowerCase() === "available"
        );
      } else {
        return this.vehicles.filter((v) => {
          return (
              (!this.TimeType ||
                  v.TimeType.toLowerCase().includes(this.TimeType.toLowerCase())) &&
              (!this.Brand ||
                  v.Brand.toLowerCase().includes(this.Brand.toLowerCase())) &&
              (!this.Model ||
                  v.Model.toLowerCase().includes(this.Model.toLowerCase())) &&
              (!this.CarClass ||
                  v.CarClass.toLowerCase().includes(this.CarClass.toLowerCase())) &&
              (!this.Transmission ||
                  v.Transmission.toLowerCase().includes(this.Transmission.toLowerCase())) &&
              (!this.RentalCost || v.RentalCost === parseFloat(this.RentalCost))
          );
        });
      }
    },
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    rentVehicle(vehicle_id) {
      localStorage.setItem("vehicle_id", vehicle_id);
      this.router.push({ path: "/rent-car" });
    }
  },
  created() {
    VehicleService.getAll()
        .then((response) => {
          this.vehicles = response.data;
        })
        .catch((error) => {
        });
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

  <div class="container">
    <h2 class="section-title">{{ $t('CarSearchTenant.title') }}</h2>
    <div class="search-card">
      <Card>
        <template #title></template>
        <template #content>
          <div class="search-fields">
            <div class="field">
              <p>{{ $t('CarSearchTenant.time_type') }}</p>
              <InputText v-model="TimeType" :placeholder="$t('CarSearchTenant.time_type')" />
            </div>
            <div class="field">
              <p>{{ $t('CarSearchTenant.brand') }}</p>
              <InputText v-model="Brand" :placeholder="$t('CarSearchTenant.brand')" />
            </div>
            <div class="field">
              <p>{{ $t('CarSearchTenant.model') }}</p>
              <InputText v-model="Model" :placeholder="$t('CarSearchTenant.model')" />
            </div>
            <div class="field">
              <p>{{ $t('CarSearchTenant.car_class') }}</p>
              <InputText v-model="CarClass" :placeholder="$t('CarSearchTenant.car_class')" />
            </div>
            <div class="field">
              <p>{{ $t('CarSearchTenant.transmission') }}</p>
              <InputText v-model="Transmission" :placeholder="$t('CarSearchTenant.transmission')" />
            </div>
            <div class="field">
              <p>{{ $t('CarSearchTenant.rental_cost') }}</p>
              <InputText v-model="RentalCost" :placeholder="$t('CarSearchTenant.rental_cost')" />
            </div>
          </div>
        </template>
      </Card>
    </div>
    <h1>{{ $t('CarSearchTenant.title2') }}</h1>
  </div>

  <div class="vehicle-list">
    <pv-card v-for="vehicle in availableVehicles" :key="vehicle.Id" class="vehicle-card">
      <template #title>{{vehicle.Brand}} {{vehicle.Model}}</template>
      <template #content>
        <img :src="this.fileService.APIGET + vehicle.UrlImage" alt="Vehicle image" class="product-image"/>
        <div class="vehicle-details">
          <p>{{ $t('CarSearchTenant.car_class') }}: {{ vehicle.CarClass }}</p>
          <p>{{ $t('CarSearchTenant.transmission') }}: {{ vehicle.Transmission }}</p>
          <p>{{ $t('CarSearchTenant.time_type') }}: {{ $t('TimeType.' + vehicle.TimeType) }}</p>
          <p>{{ $t('CarSearchTenant.rental_cost') }}: S/.{{ vehicle.RentalCost }}</p>
          <pv-button @click="rentVehicle(vehicle.Id)">{{ $t('ReadRequest.rent') }}</pv-button>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-card {
  width: 100%;
  margin-bottom: 20px;
}

.search-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.field {
  flex: 1;
  min-width: 200px;
}

.vehicle-list{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.vehicle-card{
  width: 300px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
}

.vehicle-details{
  margin-top: 10px;
}

.vehicle-card img {
  max-width: 80%;
  border-radius: 10px;
}
</style>