export interface FeatureHeader {
  readonly name: string
  readonly pluralize: string
  readonly newAction?: Action
}
export interface Action {
  readonly url: string
}
