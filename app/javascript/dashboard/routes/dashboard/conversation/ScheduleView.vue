<template>
    <div class="schedule-vue-sample">
        <div class="col-md-12 control-section">
            <div class="content-wrapper">
                <ejs-schedule id='Schedule' height="650px" :cssClass='cssClass' :selectedDate='selectedDate' :eventSettings='eventSettings'
                    :group='group' :currentView='currentView' :resourceHeaderTemplate="'resourceHeaderTemplate'">
                    <template v-slot:resourceHeaderTemplate="{data}">
                        <div class="template-wrap">
                            <div class="resource-details">
                                <div class="resource-name">{{getEmployeeName(data)}}</div>
                                <div class="resource-designation">{{getEmployeeDesignation(data)}}</div>
                            </div>
                        </div>
                    </template>
                    <e-views>
                        <e-view option="Day"></e-view>
                        <e-view option="WorkWeek"></e-view>
                        <e-view option="Month" :eventTemplate='monthEventTemplate'></e-view>
                        <e-view option="TimelineWeek"></e-view>
                    </e-views>
                    <e-resources>
                        <e-resource field='ConferenceId' title='Attendees' name='Conferences' :allowMultiple='allowMultiple' :dataSource='resourceDataSource'
                            textField='Text' idField='Id' colorField='Color'>
                        </e-resource>
                    </e-resources>

                </ejs-schedule>
            </div>
        </div>


    </div>
</template>
<style>
    .schedule-vue-sample .groupediting.e-schedule .e-month-view .e-appointment .e-appointment-details {
        padding: 1px;
        padding-left: 3px;
    }

    .schedule-vue-sample .groupediting.e-schedule .e-vertical-view .e-resource-cells {
        height: 62px;
    }

    .schedule-vue-sample .groupediting.e-schedule .template-wrap {
        display: flex;
        text-align: left;
    }

    .schedule-vue-sample .groupediting.e-schedule .template-wrap .resource-image {
        width: 45px;
        height: 45px;
        background-size: 45px;
        background-repeat: no-repeat;
    }

    .schedule-vue-sample .groupediting.e-schedule .template-wrap .resource-details {
        padding-left: 10px;
    }

    .schedule-vue-sample .groupediting.e-schedule .template-wrap .resource-details .resource-name {
        font-size: 16px;
        font-weight: 500;
        padding-right: 10px;
    }

    .schedule-vue-sample .groupediting.e-schedule .template-wrap .resource-details .resource-designation {
        font-size: 12px;
    }

    .schedule-vue-sample .groupediting.e-schedule.e-device .template-wrap .resource-details .resource-designation {
        display: none;
    }

    .schedule-vue-sample .groupediting.e-schedule.e-device .template-wrap .resource-details .resource-name {
        font-size: inherit;
        font-weight: inherit;
        padding-top: 5px;
    }

    .schedule-vue-sample .groupediting.e-schedule.e-device .e-resource-tree-popup .e-fullrow {
        height: 50px;
    }
</style>

<script>
    import { extend } from '@syncfusion/ej2-base';
    import { resourceConferenceData } from './dataSourceSchedule';
    import { ScheduleComponent, ViewDirective, ViewsDirective, ResourceDirective, ResourcesDirective, Day, WorkWeek, Month, TimelineViews, Resize, DragAndDrop } from "@syncfusion/ej2-vue-schedule";

    export default {
        components: {
          'ejs-schedule': ScheduleComponent,
          'e-view': ViewDirective,
          'e-views': ViewsDirective,
          'e-resource': ResourceDirective,
          'e-resources': ResourcesDirective
        },
        data: function () {
            return {
                eventSettings: {
                    dataSource: extend([], resourceConferenceData, null, true),
                    fields: {
                        subject: { title: 'Conference Name', name: 'Subject' },
                        description: { title: 'Summary', name: 'Description' },
                        startTime: { title: 'From', name: 'StartTime' },
                        endTime: { title: 'To', name: 'EndTime' }
                    }
                },
                selectedDate: new Date(2021, 5, 5),
                currentView: 'WorkWeek',
                cssClass: 'groupediting',
                group: {
                    allowGroupEdit: true,
                    resources: ['Conferences']
                },
                resourceDataSource: [
                    { Text: 'Margaret', Id: 1, Color: '#1aaa55' },
                    { Text: 'Robert', Id: 2, Color: '#357cd2' },
                    { Text: 'Laura', Id: 3, Color: '#7fa900' }
                ],
                allowMultiple: true,
                monthEventTemplate: function (e) {
                    return {
                        template: groupVue
                    };
                }
            }
        },
        provide: {
            schedule: [Day, WorkWeek, Month, TimelineViews, Resize, DragAndDrop]
        },
/*         computed: {
            getImage() {
                return (data) => {
                    return 'source/schedule/images/' + this.getEmployeeImage(data) + '.png';
                };
            },
        }, */
        methods: {
            getEmployeeName: function (data) {
                let value = JSON.parse(JSON.stringify(data));
                return (value.resourceData) ? value.resourceData[value.resource.textField] : value.resourceName;
            },
            getEmployeeImage: function (data) {
                let resourceName = this.getEmployeeName(data);
                return resourceName.toLowerCase();
            },
            getEmployeeDesignation: function (data) {
                let resourceName = this.getEmployeeName(data);
                return (resourceName === 'Margaret') ? 'Sales Representative' : (resourceName === 'Robert') ?
                    'Vice President, Sales' : 'Inside Sales Coordinator';
            }
        },
    };

</script>