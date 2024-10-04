<script>
import Card from 'primevue/card';
export default {
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
      items: [
        { label: "Inicio", to: "/home-owner" },
        { label: "Registro", to: "/car-registration-owner" },
        { label: "Notificaciones", to: "/notifications" },
        { label: "Alquiler", to: "/rent-owner" },
      ],
      urlContrato: null,
      urlImagen: null,
    };
  },
  created(){
    this.urlImagen = localStorage.getItem("urlVehiculo");
  },
  methods: {
    switchLanguage() {
      this.selectedLanguage = this.selectedLanguage === 'en' ? 'es' : 'en';
      this.$i18n.locale = this.selectedLanguage;
    },
    subirContrato() {
      localStorage.setItem("urlContrato", this.urlContrato);
      this.$toast.add({ severity: 'success', summary: 'Éxito', detail: 'Contrato subido exitosamente.', role: 'alert' });
    },
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
  <pv-toast aria-live="polite" />
  <div class="container" role="main">
    <div class="half-width-card">

      <Card role="region" aria-labelledby="card1Title">
        <template #title>
        </template>
        <template #content>
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
            <h1 id="card1Title" style="font-family: 'Poppins',sans-serif; color:#FF7A00">CONTRATO DE ALQUILER</h1>
            <p style="font-family: 'Poppins',sans-serif">Cree el contrato de alquiler que mejor le parezca</p>
            <p style="font-family: 'Poppins',sans-serif"><strong>URL del contrato de alquiler</strong></p>
            <pv-input placeholder="URL del contrato de alquiler" v-model="urlContrato" style="font-family: 'Poppins',sans-serif" role="textbox"></pv-input>
            <button @click="subirContrato" class="custom-button3" role="button">Subir contrato</button>
            <img :src="urlImagen" alt="Toyota Prius" style="max-width: 100%; max-height: 300px;">
            <p style="font-family: 'Poppins',sans-serif">Marca/Modelo: Toyota/Prius</p>
          </div>
        </template>
      </Card>
    </div>
    <pv-toast aria-live="polite" />

    <div class="half-width-card">
      <Card role="region" aria-labelledby="card1Title">
        <template #title></template>
        <template #content>
          <div style="text-align: center;">
            <h1 id="card1Title">CONTRATO DE ALQUILER</h1>
            <p style="font-family: 'Poppins', sans-serif;">Partes del contrato:</p>
            <p style="font-family: 'Poppins', sans-serif;">El presente contrato de alquiler de automóvil (en adelante, el "Contrato") se celebra entre:</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>El Arrendador:</strong> [Nombre del Arrendador]</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>Dirección del Arrendador:</strong> [Dirección del Arrendador]</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>Número de contacto del Arrendador:</strong> [Número de contacto del Arrendador]</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>Y</strong></p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>El Arrendatario:</strong> [Nombre del Arrendatario]</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>Dirección del Arrendatario:</strong> [Dirección del Arrendatario]</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>Número de contacto del Arrendatario:</strong> [Número de contacto del Arrendatario]</p>
            <p style="font-family: 'Poppins', sans-serif;">Ambas partes acuerdan lo siguiente:</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>1. Descripción del vehículo:</strong></p>
            <p style="font-family: 'Poppins', sans-serif;">El Arrendador acuerda alquilar al Arrendatario el siguiente vehículo:</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>2. Duración del alquiler:</strong></p>
            <p style="font-family: 'Poppins', sans-serif;">El período de alquiler comenzará a partir de la fecha [Fecha de inicio] y finalizará el [Fecha de finalización]. El Arrendatario se compromete a devolver el vehículo en la misma condición en la que lo recibió, salvo el desgaste normal.</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>3. Pago y tarifas:</strong></p>
            <p style="font-family: 'Poppins', sans-serif;">El Arrendatario acuerda pagar al Arrendador la cantidad de [Monto del alquiler] por el período de alquiler. El pago se realizará de la siguiente manera: [Detalles del pago].</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>4. Uso del vehículo:</strong></p>
            <p style="font-family: 'Poppins', sans-serif;">El vehículo se utilizará únicamente para fines personales y no comerciales. El Arrendatario se compromete a no utilizar el vehículo para actividades ilegales o peligrosas.</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>5. Mantenimiento y responsabilidad:</strong></p>
            <p style="font-family: 'Poppins', sans-serif;">El Arrendatario es responsable de mantener el vehículo en buen estado durante el período de alquiler. Cualquier daño o gasto incurrido debido a negligencia será responsabilidad del Arrendatario.</p>
            <p style="font-family: 'Poppins', sans-serif;"><strong>6. Devolución del vehículo:</strong></p>
            <p style="font-family: 'Poppins', sans-serif;">El Arrendatario se compromete a devolver el vehículo al Arrendador en la fecha y hora acordadas al final del período de alquiler.</p>
            <p style="text-align: center;"><br><br><br><strong>Firma de las partes:<br><br></strong></p>
            <p style="text-align: center;"><em>(Firma del Arrendador)</em> <em>(Firma del Arrendatario)</em></p>
            <p style="text-align: center;"><strong>Fecha:</strong> [Fecha de firma del contrato]</p>
            <br><br>
            <br><br>
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

@media (max-width: 50vmin) {
  .half-width-card {
    max-width: 100%;
  }

  .input-grid {
    flex-direction: column;
  }
}
</style>
