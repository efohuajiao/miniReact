export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export interface ReactElementType {
  $$typeof: symbol | number;
  type: ElementType;
  key: Key;
  props: Props;
  ref: Ref;
  __mark: string;
}

/**
 * 使用泛型对应触发更新的两种情况
 * 1. this.setState({x:1})
 * 2. this.setState((x) => {x:2})
 */
export type Action<State> = State | ((prevState: State) => State);
