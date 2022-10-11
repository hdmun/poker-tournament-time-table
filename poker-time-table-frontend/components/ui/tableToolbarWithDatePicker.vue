<template>
  <v-row align="center" no-gutter dense>
    <v-col cols="1" offset="6" align="right">
      <v-icon class="ma-1 pa-0" @click="onClickPrevDate">
        mdi-chevron-left
      </v-icon>
    </v-col>

    <v-col cols="4">
      <v-menu
        v-model="showDatePicker"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="selectDate"
            label="조회 날짜"
            prepend-icon="mdi-calendar"
            readonly
            single-line
            v-bind="attrs"
            v-on="on"
          />
        </template>

        <v-date-picker
          v-model="selectDate"
          :weekday-format="getWeekDay"
          :month-format="getMonth"
          :title-date-format="getTitleDate"
          :header-date-format="getHeaderDate"
          @input="onClickDatePick"
        />
      </v-menu>
    </v-col>

    <v-col cols="1">
      <v-icon class="ma-1 pa-0" @click="onClickNextDate">
        mdi-chevron-right
      </v-icon>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'nuxt-property-decorator'

@Component
export default class TableToolbarWithDatePicker extends Vue {
  selectDate: string = new Date().toISOString().substring(0, 10)
  showDatePicker: boolean = false

  mounted() {}

  @Emit('pickDate')
  onClickDatePick(_date: string) {
    this.showDatePicker = false
    return new Date(this.selectDate)
  }

  @Emit('pickDate')
  onClickPrevDate(_event: PointerEvent) {
    const date = new Date(this.selectDate)
    date.setDate(date.getDate() - 1)
    this.selectDate = date.toISOString().substring(0, 10)
    return date
  }

  @Emit('pickDate')
  onClickNextDate(_event: PointerEvent) {
    const date = new Date(this.selectDate)
    date.setDate(date.getDate() + 1)
    this.selectDate = date.toISOString().substring(0, 10)
    return date
  }

  getWeekDay(date: string) {
    const daysOfWeek = new Date(date).getDay()
    return ['일', '월', '화', '수', '목', '금', '토'][daysOfWeek]
  }

  getMonth(date: string) {
    const month = new Date(date).getMonth()
    return [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ][month]
  }

  getTitleDate(date: string) {
    const pickDate = new Date(date)
    return `${this.getMonth(date)} ${pickDate.getDay()}일 (${this.getWeekDay(
      date
    )})`
  }

  getHeaderDate(date: string) {
    const pickDate = new Date(date)
    return `${pickDate.getFullYear()} ${this.getMonth(date)}`
  }
}
</script>
