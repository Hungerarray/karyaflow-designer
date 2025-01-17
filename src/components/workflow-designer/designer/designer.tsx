import {Component, Element, Event, EventEmitter, h, Method, Prop, Watch} from '@stencil/core';
import {
  Anchor,
  Connection as JsPlumbConnection,
  DragEventCallbackOptions,
  Endpoint,
  EndpointOptions,
  jsPlumbInstance
} from "jsplumb";
import {CssClassMap, CssMap} from "../../../utils";
import {JsPlumbUtils} from "./jsplumb-utils";
import {ActivityModel} from "./models";
import uuid from 'uuid-browser/v4';
import {Activity, ActivityDefinition, ActivityDisplayMode, Point, Workflow} from "../../../models";
import ActivityManager from '../../../services/activity-manager';
import {deepClone} from "../../../utils/deep-clone";

@Component({
  tag: 'wf-designer',
  styleUrl: 'designer.scss',
  shadow: false
})
export class Designer {

  canvas: HTMLElement;

  constructor() {

  }

  @Element()
  private el: HTMLElement;

  @Prop({ reflect: true, attribute: "canvas-height" })
  canvasHeight: string;

  @Prop()
  activityDefinitions: Array<ActivityDefinition> = [];

  @Prop({ reflect: true })
  readonly: boolean;

  @Prop({ mutable: true })
  workflow: Workflow = {
    activities: [],
    connections: []
  };

  @Watch('workflow')
  onWorkflowChanged(value: Workflow) {
    this.workflowChanged.emit(deepClone(value));
  }

  @Method()
  async newWorkflow() {
    this.workflow = {
      activities: [],
      connections: []
    }
  }

  @Method()
  async getWorkflow() {
    return deepClone(this.workflow);
  }

  @Method()
  async addActivity(activityDefinition: ActivityDefinition) {
    const left = !!this.lastClickedLocation ? this.lastClickedLocation.left : 150;
    const top = !!this.lastClickedLocation ? this.lastClickedLocation.top : 150;

    const activity: Activity = {
      id: uuid(),
      top: top,
      left: left,
      type: activityDefinition.type,
      state: {}
    };

    this.lastClickedLocation = null;

    const activities = [...this.workflow.activities, activity];
    this.workflow = { ...this.workflow, activities };
  }

  @Method()
  async updateActivity(activity: Activity) {
    await this.updateActivityInternal(activity);
  }

  @Event({ eventName: 'edit_activity' })
  private editActivityEvent: EventEmitter;

  @Event({ eventName: 'add_activity' })
  private addActivityEvent: EventEmitter;

  @Event()
  workflowChanged: EventEmitter;

  jsPlumb: jsPlumbInstance;
  lastClickedLocation: Point = null;
  activityContextMenu: HTMLWfContextMenuElement;
  selectedActivity: Activity;

  private elem = (): HTMLElement => this.el;

  componentWillLoad(){
    this.jsPlumb = JsPlumbUtils.createInstance('.workflow-canvas', this.readonly);
  }

  componentDidRender() {
    this.setupJsPlumb();
    this.setupPopovers();
  }

  render() {
    const activities = this.createActivityModels();
    return (
      <host class="workflow-canvas" ref={el => this.canvas = el} style={{ height: this.canvasHeight }}>
        {activities.map((model: ActivityModel) => {
          const activity = model.activity;
          const styles: CssMap = { 'left': `${activity.left}px`, 'top': `${activity.top}px` };
          const classes: CssClassMap = {
            'activity': true,
            'activity-blocking': !!activity.blocking,
            'activity-executed': !!activity.executed,
            'activity-faulted': activity.faulted
          };

          if (!this.readonly) {
            return (
              <div id={`wf-activity-${activity.id}`} data-activity-id={activity.id} class={classes} style={styles}
                   onDblClick={() => this.onEditActivity(activity)}
                   onContextMenu={(e) => this.onActivityContextMenu(e, activity)}>
                <wf-activity-renderer activity={activity} activityDefinition={model.definition}
                                      displayMode={ActivityDisplayMode.Design}/>
              </div>);
          } else {

            classes['noselect'] = true;

            const popoverAttributes = {};

            if (!!activity.message) {
              popoverAttributes['data-toggle'] = 'popover';
              popoverAttributes['data-trigger'] = 'hover';
              popoverAttributes['title'] = activity.message.title;
              popoverAttributes['data-content'] = activity.message.content;
            }

            return (
              <div id={`wf-activity-${activity.id}`} data-activity-id={activity.id} class={classes} style={styles}
                   {...popoverAttributes}>
                <wf-activity-renderer activity={activity} activityDefinition={model.definition}
                                      displayMode={ActivityDisplayMode.Design}/>
              </div>);
          }

        })
        }
        {this.renderContextMenu()}
      </host>
    );
  }

  private renderContextMenu = () => {
    if (this.readonly)
      return null;

    return (
      [
        <wf-context-menu target={this.elem()}>
          <wf-context-menu-item text="Add Activity" onClick={this.onAddActivityClick}/>
        </wf-context-menu>,
        <wf-context-menu ref={(el) => this.activityContextMenu = el}>
          <wf-context-menu-item text="Edit" onClick={this.onEditActivityClick}/>
          <wf-context-menu-item text="Delete" onClick={this.onDeleteActivityClick}/>
        </wf-context-menu>
      ]
    );
  };

  private deleteActivity = async (activity: Activity) => {
    const activities = this.workflow.activities.filter(x => x.id !== activity.id);
    const connections = this.workflow.connections.filter(x => x.sourceActivityId != activity.id && x.destinationActivityId != activity.id);
    this.workflow = { ...this.workflow, activities, connections };
  };

  private createActivityModels(): Array<ActivityModel> {
    const workflow = this.workflow || {
      activities: [],
      connections: []
    };

    const activityDefinitions = this.activityDefinitions || [];

    return workflow.activities.map((activity: Activity) => {

      const definition = activityDefinitions.find(x => x.type == activity.type);

      return {
        activity,
        definition
      };
    });
  }

  private setupJsPlumb = () => {
    this.jsPlumb.reset();
    this.setupJsPlumbEventHandlers();
    this.jsPlumb.batch(() => {
      this.getActivityElements().forEach(this.setupActivityElement);
      this.setupConnections();
    });
    this.jsPlumb.repaintEverything();
  };

  private setupPopovers = () => {
    $('[data-toggle="popover"]').popover({});
  };

  private setupActivityElement = (element: Element) => {
    if (!this.readonly) {
      this.setupDragDrop(element);

    }
    this.setupTargets(element);
    this.setupOutcomes(element);
    this.jsPlumb.revalidate(element);
  };

  private setupDragDrop = (element: Element) => {
    let dragStart: any = null;
    let hasDragged: boolean = false;

    this.jsPlumb.draggable(element, {
      containment: "true",
      start: (params: DragEventCallbackOptions) => {
        dragStart = { left: params.e.screenX, top: params.e.screenY };
      },
      stop: async (params: DragEventCallbackOptions) => {
        hasDragged = dragStart.left !== params.e.screenX || dragStart.top !== params.e.screenY;

        if (!hasDragged)
          return;

        const activity = { ...this.findActivityByElement(element) };
        activity.left = params.pos[0];
        activity.top = params.pos[1];

        await this.updateActivityInternal(activity);
      }
    });
  };

  private setupTargets(element: Element) {
    this.jsPlumb.makeTarget(element, {
      dropOptions: { hoverClass: 'hover' },
      anchor: 'Continuous',
      endpoint: ['Blank', { radius: 4 }]
    });
  }

  private setupOutcomes(element: Element) {
    const activity = this.findActivityByElement(element);
    const definition = this.activityDefinitions.find(x => x.type == activity.type);
    const outcomes: Array<string> = ActivityManager.getOutcomes(activity, definition);
    const activityExecuted = activity.executed;

    for (let outcome of outcomes) {
      const sourceEndpointOptions: EndpointOptions = JsPlumbUtils.getSourceEndpointOptions(activity.id, outcome, activityExecuted);
      const endpointOptions: any = {
        connectorOverlays: [['Label', { label: outcome, cssClass: 'connection-label' }]],
      };
      this.jsPlumb.addEndpoint(element, endpointOptions, sourceEndpointOptions);
    }
  }

  private setupConnections = () => {
    for (let connection of this.workflow.connections) {
      const sourceEndpointId: string = JsPlumbUtils.createEndpointUuid(connection.sourceActivityId, connection.outcome);
      const sourceEndpoint: Endpoint = this.jsPlumb.getEndpoint(sourceEndpointId);
      const destinationElementId: string = `wf-activity-${connection.destinationActivityId}`;

      this.jsPlumb.connect({
        source: sourceEndpoint,
        target: destinationElementId
      });
    }
  };

  private getActivityElements(): NodeListOf<HTMLElement> {
    return this.elem().querySelectorAll(".activity");
  }

  private static getActivityId(element: Element): string {
    return element.attributes['data-activity-id'].value;
  }

  private findActivityByElement = (element: Element): Activity => {
    const id = Designer.getActivityId(element);
    return this.findActivityById(id);
  };

  private findActivityById = (id: string): Activity => this.workflow.activities.find(x => x.id === id);

  private updateActivityInternal = async (activity: Activity) => {
    const activities = [...this.workflow.activities];
    const index = activities.findIndex(x => x.id == activity.id);

    activities[index] = { ...activity };

    this.workflow = { ...this.workflow, activities };
  };

  private setupJsPlumbEventHandlers = () => {
    this.jsPlumb.bind('connection', this.connectionCreated);
    this.jsPlumb.bind('connectionDetached', this.connectionDetached);
  };

  private connectionCreated = async (info: any) => {
    const connection: JsPlumbConnection = info.connection;
    const sourceEndpoint: any = info.sourceEndpoint;
    const outcome: string = sourceEndpoint.getParameter('outcome');
    const label: any = connection.getOverlay('label');

    label.setLabel(outcome);

    // Check if we already have this connection.
    const sourceActivity: Activity = this.findActivityByElement(info.source);
    const destinationActivity: Activity = this.findActivityByElement(info.target);
    const wfConnection = this.workflow.connections.find(x => x.sourceActivityId === sourceActivity.id && x.destinationActivityId == destinationActivity.id);

    if (!wfConnection) {
      // Add created connection to list.
      const connections = [...this.workflow.connections, {
        sourceActivityId: sourceActivity.id,
        destinationActivityId: destinationActivity.id,
        outcome: outcome
      }];

      this.workflow = { ...this.workflow, connections };
    }
  };

  private connectionDetached = async (info: any) => {
    const sourceEndpoint: any = info.sourceEndpoint;
    const outcome: string = sourceEndpoint.getParameter('outcome');
    const sourceActivity: Activity = this.findActivityByElement(info.source);
    const destinationActivity: Activity = this.findActivityByElement(info.target);
    const connections = this.workflow.connections.filter(x => !(x.sourceActivityId === sourceActivity.id && x.destinationActivityId === destinationActivity.id && x.outcome === outcome));

    this.workflow = { ...this.workflow, connections };
  };

  private onEditActivity(activity: Activity) {
    const clone = deepClone(activity);
    this.editActivityEvent.emit(clone);
  }

  private onAddActivityClick = (e: MouseEvent) => {
    const el = this.elem() as HTMLElement;
    this.lastClickedLocation = {
      left: e.pageX - el.offsetLeft,
      top: e.pageY - el.offsetTop
    };
    this.addActivityEvent.emit();
  };

  private onDeleteActivityClick = async () => {
    await this.deleteActivity(this.selectedActivity);
  };

  private onEditActivityClick = () => {
    this.onEditActivity(this.selectedActivity);
  };

  private async onActivityContextMenu(e: MouseEvent, activity: Activity) {
    this.selectedActivity = activity;
    await this.activityContextMenu.handleContextMenuEvent(e);
  }
}
