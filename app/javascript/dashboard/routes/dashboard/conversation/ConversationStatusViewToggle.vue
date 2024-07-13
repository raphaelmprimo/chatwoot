<template>
	<section class="w-screen flex">
		<section class="min-w-[250px] h-full py-2 bordas">
		  <div class="h-full rounded-xl w-full py-4 px-2">
		    <label>
		      Visualização:
		    </label>
		    <woot-button
		      type="button"
		      :disabled="showing === 'kanban'"
		      class="button-visualization"
		      @click="() => toggleView('kanban')"
		    >
		      <span class="flex items-center gap-0.5">
		        <fluent-icon icon="arrow-trending-lines" size="16" />
		        Kanban
		      </span>
		    </woot-button>
		    <woot-button
		      type="button"
		      @click="() => toggleView('conversations')"
		      class="button-visualization"
		      :disabled="showing === 'conversations'"
		    > 
		      <span class="flex items-center gap-0.5">
		        <fluent-icon icon="chat" size="16" />
		        Conversas
		      </span>
		    </woot-button>

		    <section class="flex flex-col gap-8 mt-12">
		    	<div v-if="teamsList.length" >
			    	<h2>Times:</h2>
			    	<span v-for="item in teamsList" :key="item.id" class="flex items-center gap-2">
					<label :for="item.id">
			    		<input type="checkbox" :id="item.id" :value="item.id" v-model="selectedTeams">
			    		{{ item.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) }}
					</label>
			    	</span>
			    </div>

			    <div>
			    	<h2>Caixa de entrada:</h2>
			    </div>

			    <div>
					<div v-if="labelsList.length">
			    	<h2>Marcadores:</h2>
					<span v-for="label in labelsList" :key="label.id" class="flex items-center gap-2">
					<label :for="label.id">
			    		<input type="checkbox" :id="label.id" :value="label.title" v-model="selectedLabels">
			    		{{ label.description }}
					</label>
			    	</span>
				  </div>
			    </div>
		    </section>
		  </div>
		</section>
		<conversation-status-view v-if="showing === 'kanban'" :selected-teams="selectedTeams" :selected-labels="selectedLabels"/>
		<conversation-view v-else/>
	</section>
</template>

<script>
import ConversationStatusView from './ConversationStatusView'
import ConversationView from './ConversationView'
import uiSettingsMixin from 'dashboard/mixins/uiSettings';
import { mapGetters } from 'vuex';


export default {
		components: {
			'conversation-status-view': ConversationStatusView,
			'conversation-view': ConversationView,
		},
		data: function() {
			return {
				showing: 'kanban',
				selectedTeams: [],
				selectedLabels: [],
			}
	},
	mounted() {
		this.$store.dispatch('labels/get');
	},

		methods: {
			toggleView: function(value) {
				this.showing = value
			},
		
	},
		computed: {
			...mapGetters({
				teamsList: 'teams/getTeams',
				labelsList: 'labels/getLabels',
				})
			},
		mixins:[uiSettingsMixin],
	  	beforeDestroy: function() {
		    this.updateUISettings({
		      	show_secondary_sidebar: true,
					previously_used_sidebar_view: true,
				});
			},
		}
</script>


<style>
.bordas {
	border-right: 1px solid rgba(0,0,0,0.030);
}
</style>