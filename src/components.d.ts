/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Activity, ActivityDefinition, ActivityDisplayMode, ImportedWorkflowData, Workflow, WorkflowFormatDescriptor, WorkflowFormatDescriptorDictionary } from "./models";
import { SelectItem } from "./components/field-editors/select-field/models";
export namespace Components {
    interface ElsaDemo {
    }
    interface KfDemo {
        "activityDefinitionsData": string;
        "workflowData": string;
    }
    interface KfRenderer {
        "activityDefinitions": ActivityDefinition[];
        "canvasHeight": string;
        "workflow": Workflow;
    }
    interface WfActivityEditor {
        "activity": Activity;
        "activityDefinitions": Array<ActivityDefinition>;
        "show": boolean;
    }
    interface WfActivityPicker {
        "activityDefinitions": Array<ActivityDefinition>;
        "hide": () => Promise<void>;
        "show": () => Promise<void>;
    }
    interface WfActivityRenderer {
        "activity": Activity;
        "activityDefinition": ActivityDefinition;
        "displayMode": ActivityDisplayMode;
        "updateEditor": (formData: FormData) => Promise<Activity>;
    }
    interface WfBooleanField {
        "checked": boolean;
        "hint": string;
        "label": string;
        "name": string;
    }
    interface WfContextMenu {
        "handleContextMenuEvent": (e: MouseEvent) => Promise<void>;
        "target": HTMLElement | ShadowRoot;
        "targetSelector": string;
    }
    interface WfContextMenuItem {
        "text": any;
    }
    interface WfDesigner {
        "activityDefinitions": Array<ActivityDefinition>;
        "addActivity": (activityDefinition: ActivityDefinition) => Promise<void>;
        "canvasHeight": string;
        "getWorkflow": () => Promise<any>;
        "newWorkflow": () => Promise<void>;
        "readonly": boolean;
        "updateActivity": (activity: Activity) => Promise<void>;
        "workflow": Workflow;
    }
    interface WfDesignerHost {
        "activityDefinitionsData": string;
        "canvasHeight": string;
        "export": (formatDescriptor: WorkflowFormatDescriptor) => Promise<void>;
        "getWorkflow": () => Promise<any>;
        "import": () => Promise<void>;
        "newWorkflow": () => Promise<void>;
        "pluginsData": string;
        "readonly": boolean;
        "showActivityPicker": () => Promise<void>;
        "workflow": Workflow;
        "workflowData": string;
    }
    interface WfExportButton {
        "designerHostId": string;
        "workflowFormats": WorkflowFormatDescriptorDictionary;
    }
    interface WfExpressionField {
        "hint": string;
        "label": string;
        "multiline": boolean;
        "name": string;
        "syntax": string;
        "value": string;
    }
    interface WfImportExport {
        "export": (designer: HTMLWfDesignerElement, formatDescriptor: WorkflowFormatDescriptor) => Promise<void>;
        "import": (data?: ImportedWorkflowData) => Promise<void>;
    }
    interface WfListField {
        "hint": string;
        "items": string;
        "label": string;
        "name": string;
    }
    interface WfSelectField {
        "hint": string;
        "items": Array<SelectItem>;
        "label": string;
        "name": string;
        "value": string;
    }
    interface WfTextField {
        "hint": string;
        "label": string;
        "name": string;
        "value": string;
    }
}
declare global {
    interface HTMLElsaDemoElement extends Components.ElsaDemo, HTMLStencilElement {
    }
    var HTMLElsaDemoElement: {
        prototype: HTMLElsaDemoElement;
        new (): HTMLElsaDemoElement;
    };
    interface HTMLKfDemoElement extends Components.KfDemo, HTMLStencilElement {
    }
    var HTMLKfDemoElement: {
        prototype: HTMLKfDemoElement;
        new (): HTMLKfDemoElement;
    };
    interface HTMLKfRendererElement extends Components.KfRenderer, HTMLStencilElement {
    }
    var HTMLKfRendererElement: {
        prototype: HTMLKfRendererElement;
        new (): HTMLKfRendererElement;
    };
    interface HTMLWfActivityEditorElement extends Components.WfActivityEditor, HTMLStencilElement {
    }
    var HTMLWfActivityEditorElement: {
        prototype: HTMLWfActivityEditorElement;
        new (): HTMLWfActivityEditorElement;
    };
    interface HTMLWfActivityPickerElement extends Components.WfActivityPicker, HTMLStencilElement {
    }
    var HTMLWfActivityPickerElement: {
        prototype: HTMLWfActivityPickerElement;
        new (): HTMLWfActivityPickerElement;
    };
    interface HTMLWfActivityRendererElement extends Components.WfActivityRenderer, HTMLStencilElement {
    }
    var HTMLWfActivityRendererElement: {
        prototype: HTMLWfActivityRendererElement;
        new (): HTMLWfActivityRendererElement;
    };
    interface HTMLWfBooleanFieldElement extends Components.WfBooleanField, HTMLStencilElement {
    }
    var HTMLWfBooleanFieldElement: {
        prototype: HTMLWfBooleanFieldElement;
        new (): HTMLWfBooleanFieldElement;
    };
    interface HTMLWfContextMenuElement extends Components.WfContextMenu, HTMLStencilElement {
    }
    var HTMLWfContextMenuElement: {
        prototype: HTMLWfContextMenuElement;
        new (): HTMLWfContextMenuElement;
    };
    interface HTMLWfContextMenuItemElement extends Components.WfContextMenuItem, HTMLStencilElement {
    }
    var HTMLWfContextMenuItemElement: {
        prototype: HTMLWfContextMenuItemElement;
        new (): HTMLWfContextMenuItemElement;
    };
    interface HTMLWfDesignerElement extends Components.WfDesigner, HTMLStencilElement {
    }
    var HTMLWfDesignerElement: {
        prototype: HTMLWfDesignerElement;
        new (): HTMLWfDesignerElement;
    };
    interface HTMLWfDesignerHostElement extends Components.WfDesignerHost, HTMLStencilElement {
    }
    var HTMLWfDesignerHostElement: {
        prototype: HTMLWfDesignerHostElement;
        new (): HTMLWfDesignerHostElement;
    };
    interface HTMLWfExportButtonElement extends Components.WfExportButton, HTMLStencilElement {
    }
    var HTMLWfExportButtonElement: {
        prototype: HTMLWfExportButtonElement;
        new (): HTMLWfExportButtonElement;
    };
    interface HTMLWfExpressionFieldElement extends Components.WfExpressionField, HTMLStencilElement {
    }
    var HTMLWfExpressionFieldElement: {
        prototype: HTMLWfExpressionFieldElement;
        new (): HTMLWfExpressionFieldElement;
    };
    interface HTMLWfImportExportElement extends Components.WfImportExport, HTMLStencilElement {
    }
    var HTMLWfImportExportElement: {
        prototype: HTMLWfImportExportElement;
        new (): HTMLWfImportExportElement;
    };
    interface HTMLWfListFieldElement extends Components.WfListField, HTMLStencilElement {
    }
    var HTMLWfListFieldElement: {
        prototype: HTMLWfListFieldElement;
        new (): HTMLWfListFieldElement;
    };
    interface HTMLWfSelectFieldElement extends Components.WfSelectField, HTMLStencilElement {
    }
    var HTMLWfSelectFieldElement: {
        prototype: HTMLWfSelectFieldElement;
        new (): HTMLWfSelectFieldElement;
    };
    interface HTMLWfTextFieldElement extends Components.WfTextField, HTMLStencilElement {
    }
    var HTMLWfTextFieldElement: {
        prototype: HTMLWfTextFieldElement;
        new (): HTMLWfTextFieldElement;
    };
    interface HTMLElementTagNameMap {
        "elsa-demo": HTMLElsaDemoElement;
        "kf-demo": HTMLKfDemoElement;
        "kf-renderer": HTMLKfRendererElement;
        "wf-activity-editor": HTMLWfActivityEditorElement;
        "wf-activity-picker": HTMLWfActivityPickerElement;
        "wf-activity-renderer": HTMLWfActivityRendererElement;
        "wf-boolean-field": HTMLWfBooleanFieldElement;
        "wf-context-menu": HTMLWfContextMenuElement;
        "wf-context-menu-item": HTMLWfContextMenuItemElement;
        "wf-designer": HTMLWfDesignerElement;
        "wf-designer-host": HTMLWfDesignerHostElement;
        "wf-export-button": HTMLWfExportButtonElement;
        "wf-expression-field": HTMLWfExpressionFieldElement;
        "wf-import-export": HTMLWfImportExportElement;
        "wf-list-field": HTMLWfListFieldElement;
        "wf-select-field": HTMLWfSelectFieldElement;
        "wf-text-field": HTMLWfTextFieldElement;
    }
}
declare namespace LocalJSX {
    interface ElsaDemo {
    }
    interface KfDemo {
        "activityDefinitionsData"?: string;
        "workflowData"?: string;
    }
    interface KfRenderer {
        "activityDefinitions"?: ActivityDefinition[];
        "canvasHeight"?: string;
        "workflow"?: Workflow;
    }
    interface WfActivityEditor {
        "activity"?: Activity;
        "activityDefinitions"?: Array<ActivityDefinition>;
        "onUpdate_activity"?: (event: CustomEvent<any>) => void;
        "show"?: boolean;
    }
    interface WfActivityPicker {
        "activityDefinitions"?: Array<ActivityDefinition>;
        "onActivity_picked"?: (event: CustomEvent<any>) => void;
    }
    interface WfActivityRenderer {
        "activity"?: Activity;
        "activityDefinition"?: ActivityDefinition;
        "displayMode"?: ActivityDisplayMode;
    }
    interface WfBooleanField {
        "checked"?: boolean;
        "hint"?: string;
        "label"?: string;
        "name"?: string;
    }
    interface WfContextMenu {
        "onContext_menu"?: (event: CustomEvent<any>) => void;
        "target"?: HTMLElement | ShadowRoot;
        "targetSelector"?: string;
    }
    interface WfContextMenuItem {
        "text"?: any;
    }
    interface WfDesigner {
        "activityDefinitions"?: Array<ActivityDefinition>;
        "canvasHeight"?: string;
        "onAdd_activity"?: (event: CustomEvent<any>) => void;
        "onEdit_activity"?: (event: CustomEvent<any>) => void;
        "onWorkflowChanged"?: (event: CustomEvent<any>) => void;
        "readonly"?: boolean;
        "workflow"?: Workflow;
    }
    interface WfDesignerHost {
        "activityDefinitionsData"?: string;
        "canvasHeight"?: string;
        "onWorkflowChanged"?: (event: CustomEvent<any>) => void;
        "pluginsData"?: string;
        "readonly"?: boolean;
        "workflow"?: Workflow;
        "workflowData"?: string;
    }
    interface WfExportButton {
        "designerHostId"?: string;
        "onExport"?: (event: CustomEvent<any>) => void;
        "workflowFormats"?: WorkflowFormatDescriptorDictionary;
    }
    interface WfExpressionField {
        "hint"?: string;
        "label"?: string;
        "multiline"?: boolean;
        "name"?: string;
        "syntax"?: string;
        "value"?: string;
    }
    interface WfImportExport {
        "onImport_workflow"?: (event: CustomEvent<Workflow>) => void;
    }
    interface WfListField {
        "hint"?: string;
        "items"?: string;
        "label"?: string;
        "name"?: string;
    }
    interface WfSelectField {
        "hint"?: string;
        "items"?: Array<SelectItem>;
        "label"?: string;
        "name"?: string;
        "value"?: string;
    }
    interface WfTextField {
        "hint"?: string;
        "label"?: string;
        "name"?: string;
        "value"?: string;
    }
    interface IntrinsicElements {
        "elsa-demo": ElsaDemo;
        "kf-demo": KfDemo;
        "kf-renderer": KfRenderer;
        "wf-activity-editor": WfActivityEditor;
        "wf-activity-picker": WfActivityPicker;
        "wf-activity-renderer": WfActivityRenderer;
        "wf-boolean-field": WfBooleanField;
        "wf-context-menu": WfContextMenu;
        "wf-context-menu-item": WfContextMenuItem;
        "wf-designer": WfDesigner;
        "wf-designer-host": WfDesignerHost;
        "wf-export-button": WfExportButton;
        "wf-expression-field": WfExpressionField;
        "wf-import-export": WfImportExport;
        "wf-list-field": WfListField;
        "wf-select-field": WfSelectField;
        "wf-text-field": WfTextField;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "elsa-demo": LocalJSX.ElsaDemo & JSXBase.HTMLAttributes<HTMLElsaDemoElement>;
            "kf-demo": LocalJSX.KfDemo & JSXBase.HTMLAttributes<HTMLKfDemoElement>;
            "kf-renderer": LocalJSX.KfRenderer & JSXBase.HTMLAttributes<HTMLKfRendererElement>;
            "wf-activity-editor": LocalJSX.WfActivityEditor & JSXBase.HTMLAttributes<HTMLWfActivityEditorElement>;
            "wf-activity-picker": LocalJSX.WfActivityPicker & JSXBase.HTMLAttributes<HTMLWfActivityPickerElement>;
            "wf-activity-renderer": LocalJSX.WfActivityRenderer & JSXBase.HTMLAttributes<HTMLWfActivityRendererElement>;
            "wf-boolean-field": LocalJSX.WfBooleanField & JSXBase.HTMLAttributes<HTMLWfBooleanFieldElement>;
            "wf-context-menu": LocalJSX.WfContextMenu & JSXBase.HTMLAttributes<HTMLWfContextMenuElement>;
            "wf-context-menu-item": LocalJSX.WfContextMenuItem & JSXBase.HTMLAttributes<HTMLWfContextMenuItemElement>;
            "wf-designer": LocalJSX.WfDesigner & JSXBase.HTMLAttributes<HTMLWfDesignerElement>;
            "wf-designer-host": LocalJSX.WfDesignerHost & JSXBase.HTMLAttributes<HTMLWfDesignerHostElement>;
            "wf-export-button": LocalJSX.WfExportButton & JSXBase.HTMLAttributes<HTMLWfExportButtonElement>;
            "wf-expression-field": LocalJSX.WfExpressionField & JSXBase.HTMLAttributes<HTMLWfExpressionFieldElement>;
            "wf-import-export": LocalJSX.WfImportExport & JSXBase.HTMLAttributes<HTMLWfImportExportElement>;
            "wf-list-field": LocalJSX.WfListField & JSXBase.HTMLAttributes<HTMLWfListFieldElement>;
            "wf-select-field": LocalJSX.WfSelectField & JSXBase.HTMLAttributes<HTMLWfSelectFieldElement>;
            "wf-text-field": LocalJSX.WfTextField & JSXBase.HTMLAttributes<HTMLWfTextFieldElement>;
        }
    }
}
