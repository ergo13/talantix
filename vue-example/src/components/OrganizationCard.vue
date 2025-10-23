<template>
  <tr class="organization-card">
    <td @click="$emit('edit-card', organization)">{{ organization.name }}</td>
    <td @click="$emit('edit-card', organization)">{{ organization.ceo }}</td>
    <td @click="$emit('edit-card', organization)">{{ organization.number }}</td>
    <td @click="$emit('edit-card', organization)">{{ orgAddress }}</td>
    <td class="remove-col">
      <button
        class="remove-button"
        aria-label="Удалить организацию"
        label="Удалить организацию"
        type="button"
        @click="$emit('remove-card', organization.id)"
      >
        X
      </button>
    </td>
  </tr>
</template>

<script lang="ts" setup>
import type { IOrganization } from "@/types";
import { defineProps, computed } from "vue";

const { organization } = defineProps<{ organization: IOrganization }>();
const emits = defineEmits<{
  (e: "remove-card", id: number): void;
  (e: "edit-card", organization: IOrganization): void;
}>();

const orgAddress = computed(() => {
  return `г. ${organization.address.city}, ул. ${organization.address.street}, д. ${organization.address.build}`;
});
</script>

<style>
.organization-card {
  cursor: pointer;
}

.remove-col {
  text-align: left;
}

.remove-button {
  cursor: pointer;
}
</style>
