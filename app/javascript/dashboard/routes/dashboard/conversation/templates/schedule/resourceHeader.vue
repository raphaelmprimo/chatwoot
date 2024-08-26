<template v-slot:resourceHeaderTemplate="{ data }">
  <div class="template-wrap">
    <div class="employee-category">
      <div>
        <img
          class="employee-image"
          :src="getImage(data)"
          :alt="getImage(data)"
        />
      </div>
      <div class="employee-name">{{ getEmployeeName(data) }}</div>
      <div class="employee-designation">{{ getEmployeeDesignation(data) }}</div>
    </div>
  </div>
</template>
