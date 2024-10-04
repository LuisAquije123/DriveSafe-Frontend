import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-orange/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toolbar from "primevue/toolbar";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Row from "primevue/row";
import Menu from "primevue/menu";
import Icons from 'primeicons/primeicons.css'
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import Card from "primevue/card";
import Password from 'primevue/password';
import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions";
import RadioButton from 'primevue/radiobutton';
import FileUpload from "primevue/fileupload";
import ToastService from 'primevue/toastservice';
import i18n from '@/i18n/i18n.js'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(PrimeVue)
app.use(ToastService)
app.component('pv-radiobutton', RadioButton)
app.component('pv-data-view', DataView)
app.component('pv-data-view-layout-options', DataViewLayoutOptions)
app.component('pv-data-table', DataTable)
app.component('pv-column', Column)
app.component('pv-toolbar', Toolbar)
app.component('pv-input-text', InputText)
app.component('pv-password', Password)
app.component('pv-textarea', Textarea)
app.component('pv-button', Button)
app.component('pv-row', Row)
app.component('pv-menu', Menu)
app.component('pv-icons', Icons)
app.component('pv-dialog', Dialog)
app.component('pv-toast', Toast)
app.component('pv-dropdown', Dropdown)
app.component('pv-tag', Tag)
app.component('pv-card', Card)
app.component('pv-input', InputText)
app.component('pv-file-upload', FileUpload)

app.mount('#app')