<template v-if="sortBy === 'name'">
  <template v-if="sortDir === 'asc'"> &uarr; </template>
  <template v-if="sortDir === 'desc'"> &darr; </template>
</template>

<script lang="ts" setup>
const props = defineProps<{
  sortBy: string | null;
  sortDir: "asc" | "desc" | "";
}>();
</script>
