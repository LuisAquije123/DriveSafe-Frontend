<script>
import { ref } from 'vue';
import Card from "primevue/card";
import VehicleService from "@/DriveSafe/services/vehicle.service";
import RentService from "@/DriveSafe/services/rent.service";
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
      rent: [],
      vehicle: [],
      payment_processed: false,
      vehiculoFoto: ref(localStorage.getItem('vehiculoFoto')),
      vehiculoPrecio: ref(localStorage.getItem('vehiculoPrecio')),
      vehiculoTiempo: ref(localStorage.getItem('vehiculoTiempo')),
      fechaInicio: ref(localStorage.getItem('vehiculoFi')),
      fechaFin: ref(localStorage.getItem('vehiculoFf')),
      lugarRecojo: ref(localStorage.getItem('vehiculoLugar')),
      fileService: FileService
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async loadRent() {
      try {
        const rent_id = parseInt(localStorage.getItem("alquilerId"));
        const vehicle_id = parseInt(localStorage.getItem("vehiculoId"));
        const rentResponse = await RentService.getById(rent_id);
        const vehicleResponse = await VehicleService.getById(vehicle_id);
        this.rent = rentResponse.data;
        this.vehicle = vehicleResponse.data;
      } catch (error) {
      }
    },
    async cashPayment () {
      try {
        await this.pay()
        this.payment_processed = true;
      } catch (error) {
      }
    },
    async pay() {
      try {
        const rentId = parseInt(localStorage.getItem('alquilerId'));
        if (!isNaN(rentId)) {
          const response = await RentService.getById(rentId);
          const rent = response.data;
          rent.Status = 'Paid';
          RentService.update(rentId, rent);
          this.router.push('/rent-tenant');
        } else {
        }
      } catch (error) {
        throw error;
      }
    },
  },
  created() {
    this.loadRent();
  },
};
</script>

<template>
  <pv-toast aria-live="polite" />
  <header>
    <pv-toolbar class="custom-bg custom-toolbar" role="navigation">
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

  <div class="p-grid">
    <h1 style="font-family: 'Poppins', sans-serif; color: #FF7A00">{{ $t('RentPayment.title') }}</h1>

    <Card>
      <template #title>
        <h2 class="card-title">{{ $t('RentPayment.vehicle_details') }}</h2>
      </template>
      <template #content>
        <img :src="this.fileService.APIGET + vehicle.UrlImage" alt="Imagen del vehículo" style="max-width: 100%; height: auto;" />
        <h3 class="h3-method">{{ $t('RentPayment.price') }} {{ vehicle.RentalCost }}</h3>
        <h3 class="h3-method">{{ $t('RentPayment.time') }} {{ vehicle.TimeType }}</h3>
        <h3 class="h3-method">{{ $t('RentPayment.start_date') }} {{ rent.StartDate }}</h3>
        <h3 class="h3-method">{{ $t('RentPayment.end_date') }} {{ rent.EndDate }}</h3>
        <h3 class="h3-method">{{ $t('RentPayment.pick_up_place') }} {{ rent.PickUpPlace }}</h3>
      </template>
    </Card>
    <div>
      <h3 class="h3-method">{{ $t('RentPayment.select_payment_method') }}</h3>
      <button @click="pay()" class="btn-efectivo">{{ $t('RentPayment.cash_button') }}</button>
      <button><router-link to="/rent-payment-confirmation" class="btn-online">{{ $t('RentPayment.online_button') }}</router-link></button>
    </div>

    <h1 v-if="payment_processed" class="msg-procesado">{{ $t('RentPayment.payment_processed') }}</h1>
  </div>
</template>

<style scoped>
.custom-bg {
  background-color: #FFFFFF;
}

.custom-toolbar {
  border-bottom: 2px solid #1A2C63;
}

.custom-button {
  background-color: #FFA500;
  color: #000000;
}

.custom-button:hover,
.custom-button:focus {
  background-color: #1A2C63 !important;
  color: #FFFFFF !important;
}

.p-grid {
  margin-top: 20px;
}

.card-title {
  color: #FF7A00;
}

.h3-method{
  color: #000000;
}


.btn-efectivo {
  background-color: #1A2C63;
  color: #FFFFFF;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-efectivo:hover {
  background-color: #92C9ED;
}

.btn-online {
  background-color: #FFA500;
  color: #000000;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-online:hover {
  background-color: #FF7A00;
  color: #FFFFFF;
}

.msg-procesado {
  color: green;
}
</style>