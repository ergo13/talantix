<script setup lang="ts">
import OrganizationCard from "@/components/OrganizationCard.vue";
import Arrow from "@/components/Arrow.vue";
import OrganizationForm from "@/components/OrganizationForm.vue";
import organizations from "@/data/organizations.json";

import { ref, computed, TransitionGroup } from "vue";

import type { IOrganization, FormOrganization } from "@/types";

const uuid = ref(0);
const organizationsList = ref<IOrganization[]>(organizations.map((item) => ({ ...item, id: uuid.value++ })));
const orgsByPage = ref(5);
const currentPage = ref(1);
const sortBy = ref<keyof IOrganization>();
const sortDir = ref<"asc" | "desc" | "">("asc");
const filter = ref("");
const showModal = ref(false);
const isEditing = ref(false);
const editableOrganization = ref<IOrganization | null>(null);

const maxPage = computed(() => Math.ceil(organizationsList.value.length / orgsByPage.value));
const currentOrganizations = computed(() => {
  const start = (currentPage.value - 1) * orgsByPage.value;
  return sortedOrganizations.value.slice(start, start + orgsByPage.value);
});
const filtredOrganizations = computed(() => {
  if (!filter.value) return organizationsList.value;
  return [...organizationsList.value].filter((org) => org.ceo.toLowerCase().includes(filter.value.toLowerCase()));
});
const sortedOrganizations = computed(() => {
  if (!sortBy.value || !sortDir.value) return filtredOrganizations.value;
  return [...filtredOrganizations.value].sort((a, b) => {
    let compareA = a[sortBy.value!];
    let compareB = b[sortBy.value!];

    if (compareA < compareB) return sortDir.value === "asc" ? -1 : 1;
    if (compareA > compareB) return sortDir.value === "asc" ? 1 : -1;
    return 0;
  });
});

function sortOrganization(key: keyof IOrganization) {
  switch (sortDir.value) {
    case "asc":
      sortDir.value = "desc";
      break;
    case "desc":
      sortDir.value = "";
      break;
    case "":
      sortDir.value = "asc";
      break;
  }
  sortBy.value = key;
  currentPage.value = 1;
}
function submitOrganization(organization: FormOrganization) {
  if (organization.id || organization.id === 0) {
    const targetOrganization = organizationsList.value.find((org) => org.id === organization.id);
    if (targetOrganization) {
      Object.assign(targetOrganization, organization);
    }
  } else if (!organization.id) {
    organization.id = uuid.value++;
    organizationsList.value.push(organization as IOrganization);
  }
  showModal.value = false;
}
function removeOrganization(id: number) {
  organizationsList.value = organizationsList.value.filter((org) => org.id !== id);
}
function editOrganization(organization: IOrganization) {
  showModal.value = true;
  isEditing.value = true;
  editableOrganization.value = organization;
}
function resetForm() {
  isEditing.value = false;
  editableOrganization.value = null;
}
</script>

<template>
  <input v-model="filter" type="text" placeholder="Найти по ФИО" />
  <button aria-label="Добавить оргнизацию" @click="showModal = true">Добавить организацию</button>

  <table class="organization-table">
    <thead>
      <tr>
        <th @click="sortOrganization('name')">
          Название
          <Arrow :sortBy="sortBy" :sortDir="sortDir" v-if="sortBy === 'name'" />
        </th>
        <th @click="sortOrganization('ceo')">
          ФИО директора
          <Arrow :sortBy="sortBy" :sortDir="sortDir" v-if="sortBy === 'ceo'" />
        </th>
        <th>
          Номер телефона
          <Arrow :sortBy="sortBy" :sortDir="sortDir" v-if="sortBy === 'number'" />
        </th>
        <th>
          Адрес
          <Arrow :sortBy="sortBy" :sortDir="sortDir" v-if="sortBy === 'address'" />
        </th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <OrganizationCard
        v-for="org in currentOrganizations"
        :organization="org"
        :key="org.id"
        @remove-card="removeOrganization($event)"
        @edit-card="editOrganization(org)"
      />
    </tbody>
  </table>

  <section v-if="organizationsList.length">
    <button @click="currentPage > 1 ? currentPage-- : null">Предыдущая</button>
    <span class="pagination-page">Страница {{ currentPage }} из {{ maxPage }}</span>
    <button @click="currentPage < maxPage ? currentPage++ : null">Следующая</button>
  </section>
  <section v-else>Нет организаций</section>

  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showModal"
        @click.self="
          showModal = false;
          resetForm();
        "
        class="modal-backplate"
      >
        <OrganizationForm
          class="modal"
          :editableOrganization="editableOrganization"
          @submit="submitOrganization($event)"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-backplate {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  z-index: 100;
  max-width: 400px;
  width: 100%;
}

.pagination-page {
  margin: 0 12px;
}

.organization-table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
  margin: 12px 0;
}

.organization-table th {
  user-select: none;
  cursor: pointer;
}

.organization-table td,
.organization-table th {
  padding: 8px;
  border: 1px solid #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
