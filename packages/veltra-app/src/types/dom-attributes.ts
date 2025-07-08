import {
  AnimationEventHandler,
  EventHandler,
  FocusEventHandler,
  InputEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  SubmitEventHandler,
  TransitionEventHandler,
  UIEventHandler,
  WheelEventHandler,
} from "./event-handler";

type CoreAttributes = {
  id?: string;
  class?: string;
  style?: string | Partial<CSSStyleDeclaration>;
  title?: string;
  tabindex?: number;
  hidden?: boolean;
  draggable?: boolean;
  contentEditable?: boolean;
  accesskey?: string;
  lang?: string;
  spellcheck?: boolean;
  translate?: "yes" | "no";
  dir?: "ltr" | "rtl" | "auto";
  role?: string;
  slot?: string;
  part?: string;
  is?: string;
  autoCapitalize?: string;
  inputMode?: string;
  enterKeyHint?: string;
  radiogroup?: string;
  results?: number;
  security?: string;
  unselectable?: "on" | "off";
};

type EventAttributes<T extends Element = Element> = {
  // Mouse events
  onClick?: MouseEventHandler<T>;
  onDoubleClick?: MouseEventHandler<T>;
  onMouseDown?: MouseEventHandler<T>;
  onMouseUp?: MouseEventHandler<T>;
  onMouseEnter?: MouseEventHandler<T>;
  onMouseLeave?: MouseEventHandler<T>;
  onMouseOver?: MouseEventHandler<T>;
  onMouseOut?: MouseEventHandler<T>;

  // Keyboard events
  onKeyDown?: KeyboardEventHandler<T>;
  onKeyUp?: KeyboardEventHandler<T>;
  onKeyPress?: KeyboardEventHandler<T>;

  // Form events
  onInput?: InputEventHandler<T>;
  onChange?: EventHandler<Event, T>;
  onFocus?: FocusEventHandler<T>;
  onBlur?: FocusEventHandler<T>;
  onSubmit?: SubmitEventHandler<T>;
  onReset?: EventHandler<Event, T>;

  // Other UI events
  onContextMenu?: MouseEventHandler<T>;
  onWheel?: WheelEventHandler<T>;
  onScroll?: UIEventHandler<T>;
  onResize?: UIEventHandler<T>;

  // Animation & Transition
  onAnimationStart?: AnimationEventHandler<T>;
  onAnimationEnd?: AnimationEventHandler<T>;
  onAnimationIteration?: AnimationEventHandler<T>;
  onTransitionEnd?: TransitionEventHandler<T>;

  // Load/Error events
  onLoad?: EventHandler<Event, T>;
  onUnload?: EventHandler<Event, T>;
  onError?: EventHandler<Event, T>;
};

type AriaAttributes = {
  "aria-activedescendant"?: string;
  "aria-atomic"?: boolean;
  "aria-autocomplete"?: "inline" | "list" | "both" | "none";
  "aria-busy"?: boolean;
  "aria-checked"?: boolean | "mixed";
  "aria-colcount"?: number;
  "aria-colindex"?: number;
  "aria-colspan"?: number;
  "aria-controls"?: string;
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";
  "aria-describedby"?: string;
  "aria-details"?: string;
  "aria-disabled"?: boolean;
  "aria-dropeffect"?: "copy" | "execute" | "link" | "move" | "none" | "popup";
  "aria-errormessage"?: string;
  "aria-expanded"?: boolean;
  "aria-flowto"?: string;
  "aria-grabbed"?: boolean;
  "aria-haspopup"?: boolean | "dialog" | "menu" | "listbox" | "tree" | "grid";
  "aria-hidden"?: boolean;
  "aria-invalid"?: boolean | "grammar" | "spelling";
  "aria-keyshortcuts"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-level"?: number;
  "aria-live"?: "off" | "polite" | "assertive";
  "aria-modal"?: boolean;
  "aria-multiline"?: boolean;
  "aria-multiselectable"?: boolean;
  "aria-orientation"?: "horizontal" | "vertical";
  "aria-owns"?: string;
  "aria-placeholder"?: string;
  "aria-posinset"?: number;
  "aria-pressed"?: boolean | "mixed";
  "aria-readonly"?: boolean;
  "aria-relevant"?: string;
  "aria-required"?: boolean;
  "aria-roledescription"?: string;
  "aria-rowcount"?: number;
  "aria-rowindex"?: number;
  "aria-rowspan"?: number;
  "aria-selected"?: boolean;
  "aria-setsize"?: number;
  "aria-sort"?: "none" | "ascending" | "descending" | "other";
  "aria-valuemax"?: number;
  "aria-valuemin"?: number;
  "aria-valuenow"?: number;
  "aria-valuetext"?: string;
};

export type HTMLAttributes<T extends Element = Element> = CoreAttributes &
  EventAttributes<T> &
  AriaAttributes & {
    children?: JSX.Element;
    ref?: ((element: T) => void) | T;
  };

export type HTMLVoidAttributes<T extends Element = Element> = Omit<HTMLAttributes<T>, "children">;

export type HTMLAnchorAttributes<T extends Element = HTMLAnchorElement> = HTMLAttributes<T> & {
  download?: any;
  href?: string;
  hrefLang?: string;
  media?: string;
  ping?: string;
  rel?: string;
  target?: string;
  type?: string;
  referrerPolicy?: string;
};

export type HTMLImgAttributes<T extends Element = HTMLImageElement> = HTMLVoidAttributes<T> & {
  alt?: string;
  crossOrigin?: "anonymous" | "use-credentials" | "";
  decoding?: "async" | "auto" | "sync";
  height?: number | string;
  loading?: "eager" | "lazy";
  referrerPolicy?: string;
  sizes?: string;
  src?: string;
  srcSet?: string;
  useMap?: string;
  width?: number | string;
};

export type HTMLLabelAttributes<T extends Element = HTMLLabelElement> = HTMLAttributes<T> & {
  form?: string;
  for?: string;
};

export type HTMLAudioAttributes<T extends Element = HTMLAudioElement> = HTMLMediaAttributes<T>;

export type HTMLVideoAttributes<T extends Element = HTMLVideoElement> = HTMLMediaAttributes<T> & {
  height?: number | string;
  playsInline?: boolean;
  poster?: string;
  width?: number | string;
};

export type HTMLMediaAttributes<T extends Element = HTMLMediaElement> = HTMLAttributes<T> & {
  autoPlay?: boolean;
  controls?: boolean;
  controlsList?: string;
  crossOrigin?: "anonymous" | "use-credentials" | "";
  loop?: boolean;
  mediaGroup?: string;
  muted?: boolean;
  preload?: "none" | "metadata" | "auto" | "";
  src?: string;
};

export type HTMLIframeAttributes<T extends Element = HTMLIFrameElement> = HTMLAttributes<T> & {
  allow?: string;
  allowFullScreen?: boolean;
  height?: number | string;
  loading?: "eager" | "lazy";
  name?: string;
  referrerPolicy?: string;
  sandbox?: string;
  src?: string;
  srcDoc?: string;
  width?: number | string;
};

export type HTMLEmbedAttributes<T extends Element = HTMLEmbedElement> = HTMLVoidAttributes<T> & {
  height?: number | string;
  src?: string;
  type?: string;
  width?: number | string;
};

export type HTMLObjectAttributes<T extends Element = HTMLObjectElement> = HTMLAttributes<T> & {
  classID?: string;
  data?: string;
  form?: string;
  height?: number | string;
  name?: string;
  type?: string;
  useMap?: string;
  width?: number | string;
};

export type HTMLLinkAttributes<T extends Element = HTMLLinkElement> = HTMLVoidAttributes<T> & {
  as?: string;
  crossOrigin?: string;
  href?: string;
  hrefLang?: string;
  integrity?: string;
  media?: string;
  referrerPolicy?: string;
  rel?: string;
  sizes?: string;
  type?: string;
  charSet?: string;
};

export type HTMLMetaAttributes<T extends Element = HTMLMetaElement> = HTMLVoidAttributes<T> & {
  charSet?: string;
  content?: string;
  httpEquiv?: string;
  name?: string;
};

export type HTMLScriptAttributes<T extends Element = HTMLScriptElement> = HTMLAttributes<T> & {
  async?: boolean;
  charSet?: string;
  crossOrigin?: string;
  defer?: boolean;
  integrity?: string;
  noModule?: boolean;
  nonce?: string;
  referrerPolicy?: string;
  src?: string;
  type?: string;
};

export type HTMLInputAttributes<T extends Element = HTMLInputElement> = HTMLVoidAttributes<T> & {
  accept?: string;
  alt?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  capture?: boolean | "user" | "environment";
  checked?: boolean;
  crossOrigin?: "anonymous" | "use-credentials" | "";
  disabled?: boolean;
  enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send";
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  height?: number | string;
  list?: string;
  max?: number | string;
  maxLength?: number;
  min?: number | string;
  minLength?: number;
  multiple?: boolean;
  name?: string;
  pattern?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: number;
  src?: string;
  step?: number | string;
  type?: string;
  value?: string | readonly string[] | number;
  width?: number | string;
};

export type HTMLTextAreaAttributes<T extends Element = HTMLTextAreaElement> = HTMLAttributes<T> & {
  autoComplete?: string;
  autoFocus?: boolean;
  cols?: number;
  dirName?: string;
  disabled?: boolean;
  form?: string;
  maxLength?: number;
  minLength?: number;
  name?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  rows?: number;
  wrap?: "hard" | "soft" | "off";
  value?: string | number | readonly string[];
};

export type HTMLButtonAttributes<T extends Element = HTMLButtonElement> = HTMLAttributes<T> & {
  autoFocus?: boolean;
  disabled?: boolean;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  name?: string;
  type?: "submit" | "reset" | "button";
  value?: string | readonly string[] | number;
};

export type HTMLSelectAttributes<T extends Element = HTMLSelectElement> = HTMLAttributes<T> & {
  autoComplete?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  form?: string;
  multiple?: boolean;
  name?: string;
  required?: boolean;
  size?: number;
  value?: string | readonly string[] | number;
};

export type HTMLOptionAttributes<T extends Element = HTMLOptionElement> = HTMLAttributes<T> & {
  disabled?: boolean;
  label?: string;
  selected?: boolean;
  value?: string | number | string[];
};

export type HTMLFormAttributes<T extends Element = HTMLFormElement> = HTMLAttributes<T> & {
  acceptCharset?: string;
  action?: string;
  autoComplete?: string;
  encType?: string;
  method?: string;
  name?: string;
  noValidate?: boolean;
  target?: string;
};

export type HTMLFieldsetAttributes<T extends Element = HTMLFieldSetElement> = HTMLAttributes<T> & {
  disabled?: boolean;
  form?: string;
  name?: string;
};

export type HTMLLegendAttributes<T extends Element = HTMLLegendElement> = HTMLAttributes<T> & {};

export type HTMLOptgroupAttributes<T extends Element = HTMLOptGroupElement> = HTMLAttributes<T> & {
  disabled?: boolean;
  label?: string;
};

export type HTMLOutputAttributes<T extends Element = HTMLOutputElement> = HTMLAttributes<T> & {
  for?: string;
  form?: string;
  name?: string;
};

export type HTMLParamAttributes<T extends Element = HTMLParamElement> = HTMLVoidAttributes<T> & {
  name?: string;
  value?: string;
};

export type HTMLProgressAttributes<T extends Element = HTMLProgressElement> = HTMLAttributes<T> & {
  max?: number;
  value?: number;
};

export type HTMLMeterAttributes<T extends Element = HTMLMeterElement> = HTMLAttributes<T> & {
  form?: string;
  high?: number;
  low?: number;
  max?: number;
  min?: number;
  optimum?: number;
  value?: string | number;
};

export type HTMLDetailsAttributes<T extends Element = HTMLDetailsElement> = HTMLAttributes<T> & {
  open?: boolean;
};

export type HTMLSummaryAttributes<T extends Element = HTMLElement> = HTMLAttributes<T>;

export type HTMLTableAttributes<T extends Element = HTMLTableElement> = HTMLAttributes<T> & {
  cellPadding?: number | string;
  cellSpacing?: number | string;
  summary?: string;
};

export type HTMLTdAttributes<T extends Element = HTMLTableDataCellElement> = HTMLAttributes<T> & {
  colSpan?: number;
  headers?: string;
  rowSpan?: number;
  scope?: string;
  abbr?: string;
  align?: string;
};

export type HTMLThAttributes<T extends Element = HTMLTableHeaderCellElement> = HTMLAttributes<T> & {
  colSpan?: number;
  headers?: string;
  rowSpan?: number;
  scope?: string;
  abbr?: string;
  align?: string;
};

export type HTMLTimeAttributes<T extends Element = HTMLTimeElement> = HTMLAttributes<T> & {
  dateTime?: string;
};

export type HTMLTrackAttributes<T extends Element = HTMLTrackElement> = HTMLVoidAttributes<T> & {
  default?: boolean;
  kind?: string;
  label?: string;
  src?: string;
  srcLang?: string;
};

export type HTMLSourceAttributes<T extends Element = HTMLSourceElement> = HTMLVoidAttributes<T> & {
  media?: string;
  sizes?: string;
  src?: string;
  srcSet?: string;
  type?: string;
};

export type HTMLDataAttributes<T extends Element = HTMLDataElement> = HTMLAttributes<T> & {
  value?: string | number;
};

export type HTMLDelAttributes<T extends Element = HTMLModElement> = HTMLAttributes<T> & {
  cite?: string;
  dateTime?: string;
};

export type HTMLInsAttributes<T extends Element = HTMLModElement> = HTMLAttributes<T> & {
  cite?: string;
  dateTime?: string;
};
