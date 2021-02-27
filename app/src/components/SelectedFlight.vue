<template>
  <div id="flight">
    <div v-if="!selectedFlight">Click on a plane<div>&nbsp;</div></div>
    <div v-if="selectedFlight">
      <div>
        <span class="data"><span class="title">callsign:</span> {{selectedFlight.callsign}}</span>
        <span class="data"><span class="title">from:</span> {{selectedFlight.origin_country}}</span>
        <span class="data" v-if="selectedFlight.current_country"><span class="title">now in:</span> {{selectedFlight.current_country}}</span>
        <span class="data" v-if="lastContact"><span class="title">last contact:</span> {{lastContact}}</span>
      </div>
      <div>
        <span class="data"><span class="title">position:</span> {{selectedFlight.latitude}}, {{selectedFlight.longitude}}</span>
        <span class="data" v-if="!selectedFlight.on_ground"><span class="title">altitude:</span> {{selectedFlight.altitude}} m</span>
        <span class="data" v-if="!selectedFlight.on_ground"><span class="title">velocity:</span> {{selectedFlight.velocity}} m/s</span>
        <span class="data" v-if="selectedFlight.on_ground"><span class="title">location:</span> landed</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DateTime } from 'luxon';
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { Flight } from '../types/flight';

export default defineComponent({

  computed: {

    ...mapState(['selectedMarker']),

    selectedFlight(): Flight | undefined {
      return this.selectedMarker?.flight;
    },

    lastContact(): string {
      const lastContact = this.selectedMarker?.flight?.last_contact;
      if (!lastContact) {
        return '';
      }
      const loadDate = this.selectedMarker?.flight?.load_date;
      if (loadDate === lastContact) {
        return '';
      }
      return DateTime.fromISO(lastContact).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
    }

  }

});
</script>

<style scoped>
#flight {
  margin: 0;
  font-size: 10pt;
  padding: 10px;
}
.title {
  font-weight: bold;
  color: #AA00FF;
}
.data {
  color: black;
  margin-right: 1em;
}
</style>
