import { Component, h, Prop, Element } from "@stencil/core";
import {
    DragEventCallbackOptions,
    Endpoint,
    EndpointOptions,
    jsPlumbInstance,
    Connection as JsPlumbConnection
} from "jsplumb";
import { Activity, ActivityDefinition, ActivityDisplayMode, Point, Workflow } from "../../models";
import ActivityManager from "../../services/activity-manager";
import { CssMap, CssClassMap } from "../../utils";
import { deepClone } from "../../utils/deep-clone";
import { ActivityModel } from "./activity-model";
import { JsPlumbUtils } from "./jsplumb-utils";

@Component({
    tag: 'kf-renderer',
    styleUrl: './kf-renderer.scss',
    shadow: false
})
export class KfRenderer {
    canvas: HTMLElement;

    @Element()
    private el: HTMLElement;

    @Prop({ reflect: true })
    canvasHeight: string;

    @Prop()
    activityDefinitions: ActivityDefinition[] = [];


    @Prop({ mutable: true })
    workflow: Workflow = {
        activities: [],
        connections: []
    };

    jsPlumb: jsPlumbInstance;
    lastClickedLocation: Point = null;
    activityContextMenu: HTMLWfContextMenuElement;
    selectedActivity: Activity;

    private elem = (): HTMLElement => this.el;

    componentWillLoad() {
        this.jsPlumb = JsPlumbUtils.createInstance('.workflow-canvas', false);
    }

    componentDidRender() {
        this.setupJsPlumb();
        this.setupPopovers();
    }

    render() {
        const activities = this.createActivityModels();
        return (
            <host class="workflow-canvas" ref={el => this.canvas = el} style={{ height: this.canvasHeight }}>
                {
                    activities.map(
                        (model: ActivityModel) => {
                            const activity = model.activity;
                            const styles: CssMap = { 'left': `${activity.left}px`, 'top': `${activity.top}px` };
                            const classes: CssClassMap = {
                                'activity': true,
                                'activity-blocking': !!activity.blocking,
                                'activity-executed': !!activity.executed,
                                'activity-faulted': activity.faulted,
                                'noselect': true
                            };

                            const popoverAttributes = {};
                            if (!!activity.message) {
                                popoverAttributes['data-toggle'] = 'popover';
                                popoverAttributes['data-trigger'] = 'hover';
                                popoverAttributes['title'] = activity.message.title;
                                popoverAttributes['data-content'] = activity.message.content;
                            }

                            return (
                                <div id={`wf-activity-${activity.id}`}
                                    data-activity-id={activity.id}
                                    class={classes}
                                    style={styles}
                                    {...popoverAttributes}>
                                    <wf-activity-renderer activity={activity} activityDefinition={model.definition}
                                        displayMode={ActivityDisplayMode.Design} />
                                </div>);
                        }
                    )
                }
            </host>
        );
    }


    private createActivityModels(): ActivityModel[] {
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
        this.setupDragDrop(element);
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

    private static getActivityId(element: Element): string {
        return element.attributes['data-activity-id'].value;
    }

    private findActivityById = (id: string): Activity => this.workflow.activities.find(x => x.id === id);

    private findActivityByElement = (element: Element): Activity => {
        const id = KfRenderer.getActivityId(element);
        return this.findActivityById(id);
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
} 