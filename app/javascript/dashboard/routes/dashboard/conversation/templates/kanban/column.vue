<template v-slot:bodyColumn="{ data }">
  <div class="header-template-wrap">
    <div class="getClassName(data)"></div>
    <div class="header-text bg-[#ccff00]">{{ data.headerText }}</div>
  </div>
</template>

<script>
export default {
  methods: {
    getClassName: function (data) {
      return 'header-icon e-icons ' + data.keyField;
    },
  },
};
</script>
