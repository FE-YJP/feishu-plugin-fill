import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import './assets/main.css'
import App from './App.vue'

createApp(App).use(ArcoVue).use(ArcoVueIcon).mount('#app')
