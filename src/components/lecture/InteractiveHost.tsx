"use client";

import { PageAnatomy } from "./interactives/PageAnatomy";
import { HtmlLab } from "./interactives/HtmlLab";
import { CssLab } from "./interactives/CssLab";
import { JsPlayground } from "./interactives/JsPlayground";
import { TypeInspector } from "./interactives/TypeInspector";
import { ObjectLab } from "./interactives/ObjectLab";
import { DomLab } from "./interactives/DomLab";
import { AjaxClient } from "./interactives/AjaxClient";
import { ReactSandbox } from "./interactives/ReactSandbox";
import { ReactExerciseLookup } from "./interactives/ReactExerciseLookup";

type AnyComponent = (props: any) => React.ReactElement | null;

const REGISTRY: Record<string, AnyComponent> = {
  PageAnatomy: PageAnatomy as AnyComponent,
  HtmlLab: HtmlLab as AnyComponent,
  CssLab: CssLab as AnyComponent,
  JsPlayground: JsPlayground as AnyComponent,
  TypeInspector: TypeInspector as AnyComponent,
  ObjectLab: ObjectLab as AnyComponent,
  DomLab: DomLab as AnyComponent,
  AjaxClient: AjaxClient as AnyComponent,
  ReactSandbox: ReactSandbox as AnyComponent,
  ReactExercise: ReactExerciseLookup as AnyComponent,
};

export function InteractiveHost({ componentKey }: { componentKey: string }) {
  const Component = REGISTRY[componentKey];
  if (!Component) {
    return (
      <div className="paper p-4 text-fg-faint text-sm">
        Interactive component <code className="font-mono">{componentKey}</code> not found.
      </div>
    );
  }
  return <Component />;
}
