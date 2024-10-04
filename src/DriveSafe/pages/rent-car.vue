<script>
import Swal from 'sweetalert2';
import Card from "primevue/card"
import InputText from "primevue/inputtext";
import VehicleService from "@/DriveSafe/services/vehicle.service";
import RentService from "@/DriveSafe/services/rent.service";
import {useRouter} from "vue-router";
import UserService from "@/DriveSafe/services/user.service";
import {jwtDecode} from "jwt-decode";
import FileService from "@/DriveSafe/services/file.service";

export default {
  components: {
    Card,
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
      value1: null,
      cardCount: 4,
      vehicle: null,
      RentTime: null,
      cost: null,
      owner: null,
      PickUpPlace: null,
      router: useRouter(),
      fileService: FileService
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    crearAlquiler() {
      const token = localStorage.getItem("userToken");
      const decodedToken = jwtDecode(token);

      const userId = decodedToken['Id'];

      const alquilerData = {
        Status: "Pending",
        StartDate: new Date(1,0,1).toISOString().split('T')[0],
        EndDate: new Date(1,0,1).toISOString().split('T')[0],
        VehicleId: this.vehicle.Id,
        OwnerId: this.owner.Id,
        TenantId: parseInt(userId),
        PickUpPlace: this.vehicle.PickUpPlace
      };
      RentService.create(alquilerData)
          .then(() => {
            localStorage.setItem("vehiculoId", null);
            Swal.fire({
              title: this.$t('RentCar.alerts.title'),
              text: this.$t('RentCar.alerts.rent_success'),
              icon: 'success',
              confirmButtonText: 'OK'
            })
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: this.$t('RentCar.alerts.rent_error'),
            });
          });
    },
  },

  created() {
    const vehicleId = localStorage.getItem("vehicle_id");
    if (vehicleId) {
      VehicleService.getAll()
          .then((response) => {
            const vehicleFind = response.data.find(
                (v) => v.Id === parseInt(vehicleId)
            );
            if (vehicleFind) {
              this.vehicle = vehicleFind;
              UserService.getUserById(parseInt(this.vehicle.OwnerId))
                  .then((response) => {
                    this.owner = response.data;
                  })
                  .catch((error) => {
                  });

            } else {
            }
          })
          .catch((error) => {
          });
    } else {
    }
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

  <pv-toast aria-live="polite" />
  <div class="container" role="main">
    <div class="half-width-card">
      <Card role="region" aria-labelledby="card1Title">
        <template #title>
          <h2 id="card1Title" style="font-family: 'Poppins',sans-serif; text-align: center; color: #FF7A00;">{{ $t('RentCar.title') }}</h2>
        </template>
        <template #content>
          <div v-if="vehicle" class="center-content">
            <img
                :src="this.fileService.APIGET + vehicle.UrlImage"
                alt="Imagen de vehículo"
                style="max-width: 100%; max-height: 300px;"
            />
            <div class="card-title">{{ vehicle.Brand }} {{ vehicle.Model }}</div>
          </div>
          <div v-else>
            <p>Cargando información del vehículo...</p>
          </div>
        </template>
      </Card>
    </div>
    <div class="half-width-card">
      <Card role="form" aria-labelledby="card2Title">
        <template #title>
          <div style="text-align: center;">

          </div>
        </template>
        <template #content>
          <div>
            <h1>{{$t('RentCar.title_contract')}}</h1>
            <h1>{{$t('RentCar.description1')}} {{ owner ? owner.Name + ' ' + owner.LastName : '...' }}, {{$t('RentCar.description2')}}</h1>
          </div>
          <Button @click="crearAlquiler" style="font-family: 'Poppins',sans-serif" class="font-button" role="button">{{$t('RentCar.button_rent')}}</Button>
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

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
