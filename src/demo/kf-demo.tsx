import { Component, h, Prop } from "@stencil/core";
import { ActivityDefinition, Workflow } from "../models";
import pluginStore from "../services/workflow-plugin-store";

@Component({
    tag: 'kf-demo',
})
export class KfDemo {

    pluginsData = "PrimitiveActivities ControlFlowActivities EmailActivities HttpActivities ConsoleActivities MassTransitActivities TimerActivities";
    @Prop() activityDefinitionsData = '[{"type": "Custom", "displayName": "Custom", "description": "Custom Activity", "category": "Custom", "designer": { "outcomes": ["Done"] }}]';
    @Prop() workflowData = '{"activities":[{"id":"timer","top":10,"left":10,"type":"TimerEvent","state":{}, "executed":true},{"id":"send-email","top":220,"left":100,"type":"SendEmail","state":{}, "blocking":true},{"id":"if-else","top":100,"left":500,"type":"IfElse","state":{}},{"id":"log","top":300,"left":400,"type":"Log","state":{}, "faulted":true, "message":{"title":"Faulted","content":"This didnt work."}}],"connections":[{"sourceActivityId":"timer","destinationActivityId":"if-else","outcome":"Done"},{"sourceActivityId":"if-else","destinationActivityId":"send-email","outcome":"True"},{"sourceActivityId":"if-else","destinationActivityId":"log","outcome":"False"}]}';

    activityDefinitions: ActivityDefinition[];
    workflow: Workflow;
    

    private loadActivityDefinitions = (): ActivityDefinition[] => {
        const pluginsData = this.pluginsData || '';
        const pluginNames = pluginsData.split(/[ ,]+/).map(x => x.trim());

        return pluginStore
            .list()
            .filter(x => pluginNames.indexOf(x.getName()) > -1)
            .filter(x => !!x.getActivityDefinitions)
            .map(x => x.getActivityDefinitions())
            .reduce((a, b) => a.concat(b), []);
    };

    private initActivityDefinitions = () => {
        this.activityDefinitions = this.loadActivityDefinitions();

        if (!!this.activityDefinitionsData) {
            const definitions = JSON.parse(this.activityDefinitionsData);
            this.activityDefinitions = [...this.activityDefinitions, ...definitions]
        }
    };
    
    private initWorkflow = () => {
        if (!!this.workflowData) {
            const workflow: Workflow = JSON.parse(this.workflowData);

            if (!workflow.activities)
                workflow.activities = [];

            if (!workflow.connections)
                workflow.connections = [];

            this.workflow = workflow;
        }
    };

    componentWillLoad() {
        this.initActivityDefinitions();
        this.initWorkflow();
    }

    render() {

        return (
            <kf-renderer
                workflow={this.workflow}  
                activityDefinitions={this.activityDefinitions}
            ></kf-renderer>
        );
    }
}