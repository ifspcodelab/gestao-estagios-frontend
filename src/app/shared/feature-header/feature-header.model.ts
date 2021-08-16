export interface FeatureHeader {
  readonly title: string
  readonly action?: Action
}
export interface Action {
  readonly type: string,
  readonly title: string,
  readonly url?: string,
  readonly fn?: () => void
}
