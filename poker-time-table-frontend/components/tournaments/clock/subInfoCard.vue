<template>
  <v-card class="fill-height" color="gray7" outlined tile>
    <v-card-title class="play-info-title"> {{ title }}</v-card-title>
    <v-card-title class="pt-0 play-info-value">
      {{ value }}
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class SubInfoCard extends Vue {
  @Prop({ type: String, required: true })
  title!: string

  @Prop({ type: String, required: true })
  value!: string

  mounted() {}
}
</script>

<style scoped lang="scss">
@import '~/assets/variables.scss';

.play-info-title {
  @extend .small-copy-2;
  @extend .gray3-color;

  justify-content: center;
}

.play-info-value {
  @extend .sub-copy-exbold;
  @extend .gray1-color;

  justify-content: center;
}
</style>
