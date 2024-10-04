<script>
import Card from 'primevue/card';
import VehicleService from "@/DriveSafe/services/vehicle.service";
import {useRouter} from "vue-router";
import Swal from "sweetalert2";
import RentService from "@/DriveSafe/services/rent.service";
import {jwtDecode} from "jwt-decode";
import FileService from "@/DriveSafe/services/file.service";
export default {
  components: {
    Card,
  },
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
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      vehicles_filtered: [],
      router: useRouter(),
      fileService: FileService
    };
  },
  methods: {
    VehicleService() {
      return VehicleService
    },
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async loadVehicles() {
      try {

        const token = localStorage.getItem("userToken");
        const decodedToken = jwtDecode(token);

        const userId = decodedToken['Id'];

        const response = await VehicleService.getByUserId(parseInt(userId));
        this.vehicles_filtered = response.data;
      } catch (error) {
      }
    },
    async deletePost(idVehiculo) {
      try {
        const response = await RentService.getAll();
        const rents = response.data;
        const rentsToDelete = rents.filter(r => r.VehicleId === idVehiculo);
        for (const rent of rentsToDelete) {
          await RentService.delete(rent.Id);
        }
        await VehicleService.delete(idVehiculo);
        this.loadVehicles();
        await Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Publicación eliminada correctamente.'
        });
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al eliminar la publicación.'
        });
      }
    },
    seeRequest(vehiculoId) {
      localStorage.setItem("vehiculoAlquiladoId", vehiculoId);
      this.router.push({path:"/read-request"});
    }
  },
  created() {
    this.loadVehicles();
  },
};
</script>

<template>
  <pv-toast aria-live="polite" />
  <header>
    <pv-toolbar class="custom-bg custom-toolbar" role="navigation">
      <template #start>
        <img
            src="https://i.postimg.cc/2jd7PRtj/Drive-Safe-Logo.pngP"
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
          <router-link to="/profile-owner" role="menuitem">
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
  <h1 id="vehiclesTitle" style="font-family: 'Poppins', sans-serif; color: #FF7A00">{{ $t('RentOwner.title1') }}</h1>
  <div class="card-container" role="region" aria-labelledby="vehiclesTitle">
    <div class="card-item" v-for="vehicle in vehicles_filtered" :key="vehicle.Id">
      <pv-card role="region" aria-labelledby="cardTitle{{vehicle.Id}}">
        <template #title></template>
        <template #content>
          <img :src="this.fileService.APIGET + vehicle.UrlImage" alt="Imagen del vehículo" style="max-width: 100%; height: auto;" />
          <p id="cardTitle{{vehicle.Id}}" style="font-family: 'Poppins', sans-serif"></p>
          <p style="font-family: 'Poppins', sans-serif">{{ $t('RentOwner.brand_model') }} {{ vehicle.Brand }}/{{ vehicle.Model }}</p>
          <h1 style="font-family: 'Poppins', sans-serif; color: #FF7A00">{{ $t('RentOwner.status') }} {{ vehicle.RentStatus }}</h1>
          <button class="custom-button3" @click="deletePost(vehicle.Id)" role="button">{{ $t('RentOwner.delete_button') }}</button>
          <button v-if="vehicle.RentStatus === 'Required'" class="custom-button3" @click="seeRequest(vehicle.Id)" role="button">{{ $t('RentOwner.see_request') }}</button>
        </template>
      </pv-card>
    </div>
  </div>

</template>


<style>
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

.container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.half-width-card {
  flex: 1;
  width: calc(50% - 1rem);
  margin: 0.5rem;
  box-sizing: border-box;
  max-width: 50%;
}

.half-width-card p,
.half-width-card pv-input,
.half-width-card Button {
  font-size: 1rem;
}

.input-grid {
  display: flex;
  justify-content: space-between;
}

.input-column {
  flex: 1;
  padding: 0 1rem;
  box-sizing: border-box;
}

.custom-button2 {
  width: 30%;
  height: 30px;
  margin: 20px;
  background-color: #FF7A00;
  color: white;
  font-family: 'Poppins', sans-serif;
  border: none;
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

.custom-button2:hover {
  background-color: rgba(255, 122, 0, 0.9);
}

.custom-button3:hover {
  background-color: #CCCCCC;
  color: black
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-space {
  height: 20px;
}

.card-container {
  display: flex;
  flex-wrap: wrap; 
  gap: 10px; 
}

.card-item {
  width: calc(33.33% - 10px);
  margin-bottom: 10px;
}

@media (max-width: 50vmin) {
  .half-width-card {
    max-width: 100%;
  }

  .input-grid {
    flex-direction: column;
  }
}
</style>
