import { Component, h, Prop } from "@stencil/core";
import { ActivityDefinition, Workflow } from "../../models";

@Component({
    tag: 'kf-renderer',
    styleUrl: './kf-renderer.scss',
    shadow: false
})
export class KfRenderer {

    @Prop() workflow: Workflow;
    @Prop() activityDefinitions: ActivityDefinition[];

    
    render() {
       return (
        <wf-designer
            workflow={this.workflow}
            activityDefinitions={this.activityDefinitions}
            canvasHeight="100vh"
            readonly={true}
        ></wf-designer>
       ); 
    }
} 