<template>
	<div v-if="!connected">
		<b-alert dismissible variant="warning" show>Warning: You have no internet connection!</b-alert>
	</div>	
</template>

<script>
  export default {
    computed: {
      connected() {
        return this.$store.getters['connected'];
      }
    }
  }
</script>