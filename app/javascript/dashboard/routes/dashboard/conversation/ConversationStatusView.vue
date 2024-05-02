<template>
  <bryntum-task-board
    ref="taskboard"
    tooltip="taskBoardConfig.tooltip"
    v-bind="taskboardConfig"
    @click="onClick"
  />
</template>

<script>
import { BryntumTaskBoard } from '@bryntum/taskboard-vue';
import { taskboardConfig } from './configConversationStatus';

export default {
  components: {
    BryntumTaskBoard,
  },
  data() {
    return { taskboardConfig };
  },
};
</script>

<style lang="scss">
@import './conversationStatus.scss';
</style>
