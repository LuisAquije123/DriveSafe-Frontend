<script>
import Card from 'primevue/card';
import VehicleService from "@/DriveSafe/services/vehicle.service";
import RentService from "@/DriveSafe/services/rent.service";
import UserService from "@/DriveSafe/services/user.service";
import { useRouter } from "vue-router";
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
    }
  },
  components: {
    Card,
  },
  data() {
    return {
      languageOptions: [
        { label: 'EN', value: 'en' },
        { label: 'ES', value: 'es' }
      ],
      selectedLanguage: 'en',
      drawer: false,
      rent: null,
      tenant: null,
      vehicle: null,
      router: useRouter(),
      fileService: FileService
    };
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    async loadInformation() {
      try {
        const rent_id = parseInt(localStorage.getItem("alquilerId"));


        const response = await RentService.getById(rent_id);
        this.rent = response.data;

        const tenantResponse = await UserService.getUserById(this.rent.TenantId);
        this.tenant = tenantResponse.data;

        const vehicleResponse = await VehicleService.getById(this.rent.VehicleId);
        this.vehicle = vehicleResponse.data;
      } catch (error) {
      }
    },
    async acceptRent() {
      try {
        const response = await RentService.getById(this.rent.Id);
        const rentComplete = response.data;

        let formattedDate = " ";
        let formattedDateF = " ";
        rentComplete.Status = "Accepted";

        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();

        formattedDate = `${year}-${month}-${day}`;

        let aditionalDays = 0;
        if (this.vehicle.TimeType === "Daily") {
          aditionalDays = 1;
        } else if (this.vehicle.TimeType === "Weekly") {
          aditionalDays = 7;
        } else if (this.vehicle.TimeType === "Monthly") {
          aditionalDays = 30;
        }
        const futureDate = new Date(today);
        futureDate.setDate(futureDate.getDate() + aditionalDays);
        const dayf = futureDate.getDate().toString().padStart(2, '0');
        const monthf = (futureDate.getMonth() + 1).toString().padStart(2, '0');
        const yearf = futureDate.getFullYear();

        formattedDateF = `${yearf}-${monthf}-${dayf}`;

        rentComplete.StartDate = formattedDate;
        rentComplete.EndDate = formattedDateF;

        await RentService.update(this.rent.Id, rentComplete);
        this.rent.Status = "Accepted";
      } catch (error) {
      }
    },
    async refuseRent() {
      try {
        const response = await RentService.getById(this.rent.Id);
        const rentComplete = response.data;

        rentComplete.Status = "Refused";
        await RentService.update(this.rent.Id, rentComplete);
        this.rent.Status = "Refused";
      } catch (error) {
      }
    },
  },
  created() {
    this.loadInformation();
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
            aria-label="Logo de la aplicación DriveSafe"
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
          <router-link to="/profile-owner" aria-label="Perfil de usuario">
            <img
                src="https://i.postimg.cc/Fs9Z3g3V/usuario-1.png"
                alt="Usuario"
                style="height: 30px; margin-left: 20px; cursor: pointer;"
                aria-label="Perfil de usuario"
            />
          </router-link>
        </div>
      </template>
    </pv-toolbar>
  </header>

  <div class="container">
    <div class="half-width-card">
      <pv-card v-if="tenant">
        <template #title>
          <h1 style="font-family: 'Poppins', sans-serif">{{$t('ReadRequest.rent')}}</h1>
        </template>
        <template #content>
          <div>
            <h2>{{$t('ReadRequest.tenant_name')}} {{ tenant.Name }}</h2>
            <h2>{{$t('ReadRequest.tenant_lastname')}}{{ tenant.LastName }}</h2>
            <h2> {{$t('ReadRequest.tenant_phone')}} {{ tenant.Cellphone }}</h2>
            <h2>{{$t('ReadRequest.tenant_email')}} {{ tenant.Gmail }}</h2>
          </div>
          <div>
          </div>
        </template>
      </pv-card>
    </div>

    <div class="half-width-card">
      <Card>
        <template #title>

        </template>
        <template #content>
          <h2 style="font-family: 'Poppins', sans-serif">{{$t('ReadRequest.rent_options')}}</h2>

          <div v-if="rent">
            <div v-if="rent.Status === 'Accepted'">
              <p>{{$t('ReadRequest.request_accepted')}}</p>
            </div>
            <div v-if="rent.Status === 'Paid'">
              <p>{{$t('ReadRequest.request_paid')}}</p>
            </div>
            <div v-if="rent.Status === 'Pending'">
              <Button @click="acceptRent" class="accept-button" aria-label="Aceptar">{{ $t('ReadRequest.accept_button') }}</Button>
              <Button @click="refuseRent" class="decline-button" aria-label="Declinar">{{ $t('ReadRequest.refuse_button') }}</Button>
            </div>
            <div v-if="rent.Status === 'Refused'">
              <p>{{$t('ReadRequest.request_refused')}}</p>
            </div>
          </div>

        </template>
      </Card>
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
  background-color: #1A2C63 !important;
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
  width: auto;
  height: 30px;
  margin: 20px;
  background-color: #1A2C63;
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
  background-color: #1A2C63;
}

.custom-button3:hover {
  background-color: #CCCCCC;
  color: black
}

.custom-button:hover,
.custom-button:focus {
  background-color: #1A2C63 !important;
  color: white !important;
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

.accept-button {
  font-family: 'Poppins', sans-serif;
  background-color: #FF7A00;
  color: white;
  border: none;
  padding: 15px 30px;
  margin-right: 10px;
  transition: background-color 0.3s;
}

.decline-button {
  font-family: 'Poppins', sans-serif;
  background-color: #1A2C63;
  color: white;
  border: none;
  padding: 15px 30px;
  transition: background-color 0.3s;
}

.accept-button:hover {
  background-color: black;
}

.decline-button:hover {
  background-color: black;
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
