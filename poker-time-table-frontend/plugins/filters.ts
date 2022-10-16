import Vue from 'vue'

export function toComma(val: number): string {
  return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
Vue.filter('toComma', toComma)
