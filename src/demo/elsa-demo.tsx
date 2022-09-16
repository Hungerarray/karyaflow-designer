import { Component, h } from "@stencil/core";

@Component({
	tag: 'elsa-demo',
	styleUrl: './elsa-demo.scss'
})
export class ElsaDemo {

	designerHost: HTMLWfDesignerHostElement;

	addActivity() {
		this.designerHost.showActivityPicker();
	}

	createNewWorkflow() {
		if (confirm('Are you sure you want to discard current changes?'))
			this.designerHost.newWorkflow();
	}

	importWorkflow() {
		this.designerHost.import();
	}


	render() {
		return (
			<host>
				<div id="header"
					class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-dark border-bottom shadow-sm">
					<h5 class="my-0 mr-md-auto font-weight-normal">Workflow Designer</h5>

					<ul class="nav">
						<li class="nav-item">
							<button class="btn btn-primary" onClick={this.addActivity}>Add Activity</button>
						</li>
						<li class="nav-item">
							<wf-export-button workflow-designer-host="designerHost"></wf-export-button>
						</li>
						<li class="nav-item">
							<button class="btn btn-secondary" onClick={this.importWorkflow}>Import</button>
						</li>
						<li class="nav-item">
							<button class="btn btn-secondary" onClick={this.createNewWorkflow}>New Workflow</button>
						</li>
					</ul>
				</div>

				<div class="container-fluid">
					<div class="row">
						<div class="col-12">
							<div class="card">
								<wf-designer-host
									id="designerHost"
									canvas-height="300vh"
									pluginsData="PrimitiveActivities ControlFlowActivities EmailActivities HttpActivities ConsoleActivities MassTransitActivities TimerActivities"
									data-activity-definitions='[{"type": "Custom", "displayName": "Custom", "description": "Custom Activity", "category": "Custom", "designer": { "outcomes": ["Done"] }}]'
									data-workflow='{"activities":[{"id":"timer","top":10,"left":10,"type":"TimerEvent","state":{}, "executed":true},{"id":"send-email","top":220,"left":100,"type":"SendEmail","state":{}, "blocking":true},{"id":"if-else","top":100,"left":500,"type":"IfElse","state":{}},{"id":"log","top":300,"left":400,"type":"Log","state":{}, "faulted":true, "message":{"title":"Faulted","content":"This didnt work."}}],"connections":[{"sourceActivityId":"timer","destinationActivityId":"if-else","outcome":"Done"},{"sourceActivityId":"if-else","destinationActivityId":"send-email","outcome":"True"},{"sourceActivityId":"if-else","destinationActivityId":"log","outcome":"False"}]}'
									readonly={false}
									ref={el => this.designerHost = el}
								>
								</wf-designer-host>
							</div>
						</div>
					</div>
				</div>

			</host>
		);
	}
}