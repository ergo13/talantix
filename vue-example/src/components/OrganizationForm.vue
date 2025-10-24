<template>
  <form @submit="submitHandler" @input="validateForm">
    <h2>{{ formLabel }}</h2>
    <div class="flex-column">
      <label for="organization-name">Название организации</label>
      <input type="text" v-model="organizationForm.name" />
    </div>

    <div class="flex-column">
      <label for="ceo-name"> ФИО директора</label>
      <input type="text" v-model="organizationForm.ceo" />
    </div>

    <div class="flex-column">
      <label for="organization-phone">Номер телефона</label>
      <input type="text" v-model="organizationForm.number" />
    </div>

    <fieldset>
      <legend>Адрес</legend>
      <div class="flex-column">
        <label for="city">Город</label>
        <input type="text" id="city" v-model="organizationForm.address.city" />
      </div>

      <div class="flex-column">
        <label for="street">Улица</label>
        <input type="text" id="street" v-model="organizationForm.address.street" />
      </div>

      <div class="flex-column">
        <label for="build">Строение</label>
        <input type="text" id="build" v-model="organizationForm.address.build" />
      </div>
    </fieldset>

    <button type="submit" class="submit-button" :disabled="!isFormValid">Ок</button>
  </form>
</template>

<script lang="ts" setup>
import type { FormOrganization, IOrganization } from "@/types";
import { onMounted, ref, computed, toRaw } from "vue";

const props = defineProps<{
  editableOrganization?: IOrganization | null;
}>();

const emits = defineEmits<{
  (e: "submit", organization: FormOrganization): void;
}>();

const errors = ref<Partial<FormOrganization>>({
  name: "",
  ceo: "",
  number: "",
  address: {
    city: "",
    street: "",
    build: "",
  },
});
const organizationForm = ref<FormOrganization>({
  name: "",
  ceo: "",
  number: "",
  id: null,
  address: {
    city: "",
    street: "",
    build: "",
  },
});

const isFormValid = computed(() => {
  const checkList = [
    errors.value.name,
    errors.value.ceo,
    errors.value.number,
    errors.value.address?.city,
    errors.value.address?.street,
    errors.value.address?.build,
  ];
  return checkList.every((e) => !e);
});
const formLabel = computed(() => {
  return organizationForm.value.id !== null ? `Редактирование ${organizationForm.value.name}` : "Добавление организации";
});

function submitHandler(event: Event) {
  event.preventDefault();
  validateForm();
  emits("submit", organizationForm.value);
}

function validateForm() {
  const errs: typeof errors.value = {
    name: "",
    ceo: "",
    number: "",
    address: {
      city: "",
      street: "",
      build: "",
    },
  };

  if (!organizationForm.value.name.trim()) errs.name = "Название обязательно";
  else if (organizationForm.value.name.length < 2) errs.name = "Минимум 2 символа";

  if (!organizationForm.value.ceo.trim()) errs.ceo = "ФИО директора обязательно";
  else if (organizationForm.value.ceo.length < 3) errs.ceo = "Минимум 3 символа";

  if (!organizationForm.value.number.trim()) errs.number = "Номер телефона обязателен";

  if (!organizationForm.value.address.city.trim()) errs.address!.city = "Город обязателен";
  if (!organizationForm.value.address.street.trim()) errs.address!.street = "Улица обязательна";
  if (!organizationForm.value.address.build.trim()) errs.address!.build = "Строение обязательно";

  errors.value = errs;
}

onMounted(() => {
  if (props.editableOrganization) {
    organizationForm.value = structuredClone(toRaw(props.editableOrganization));
  }

  validateForm();
});
</script>

<style scoped>
.flex-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}

.submit-button {
  margin-top: 8px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
