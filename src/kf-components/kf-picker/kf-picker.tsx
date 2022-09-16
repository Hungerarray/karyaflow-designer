import { Component, EventEmitter, h, Prop, Event, Listen, State } from "@stencil/core";
import { Fragment } from "@stencil/core/internal";
import { ActivityDefinition } from "../../models";
import { CssClassMap } from "../../utils";

interface CategoryMap {
  [category: string]: ActivityDefinition[]
};

@Component({
  tag: 'kf-picker',
})
export class KfPicker {

  @Prop() activityDefinitions: ActivityDefinition[];

  @Event({
    bubbles: true,
    composed: true,
  })
  activitySelected: EventEmitter<ActivityDefinition>;

  private categoryMap: CategoryMap = {};

  @State() private selectedActivity?: ActivityDefinition;

  @Listen('activitySelected')
  activityClicked(event: CustomEvent<ActivityDefinition>) {
    this.selectedActivity = event.detail;
  }

  componentWillLoad() {
    for (let definition of this.activityDefinitions) {
      if (this.categoryMap[definition.category] === undefined) {
        this.categoryMap[definition.category] = [];
      }
      this.categoryMap[definition.category].push(definition);
    }
  }

  private renderList(map: CategoryMap) {
    return (
      Object.keys(map).map(
        key => this.renderCategory(key, map[key])
      )
    );
  }

  private renderCategory(category: string, activities: ActivityDefinition[]) {
    let id: string = `${category.replace(' ', '-')}`;

    return (
      <Fragment>
        <button
          class="list-group list-group-item list-group-item-action"
          data-toggle="collapse"
          data-target={`#${id}`}
        >
          <h4>{category}</h4>
        </button>
        <div class="collapse" id={id}>
          {
            activities.map(activity => this.renderActivity(activity))
          }
        </div>
        </Fragment>
    );
  }

  private renderActivity(activity: ActivityDefinition) {
    const icon = activity.icon || 'fas fa-cog';
    const iconClass = `${icon} mr-1`;
    const classes: CssClassMap = {
      'list-group-item': true,
      'list-group-item-action': true,
      'active': activity === this.selectedActivity,
    };

    return (
      <button class={classes}
        onClick={() => this.activitySelected.emit(activity)}>
        <h5> <i class={iconClass}></i>{activity.displayName}</h5>
        <p>{activity.description}</p>
      </button>
    );
  }

  render() {

    return (
      <div class="container-fluid border m-1">
        <div class="row">
          <div class="col p-2">
            <h4 class="font-weight-bold">Available Activities</h4>
          </div>
        </div>
        <div class="row">
          <div class="col list-group pr-0 overflow-auto">
            {this.renderList(this.categoryMap)}
          </div>
        </div>

      </div>
    );
  }
}