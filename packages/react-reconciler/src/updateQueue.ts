import { Action } from 'packages/shared/ReactTypes';

export interface Update<State> {
  action: Action<State>;
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
}

/**
 * 创建需要更新的数据结构
 * @param action 更新的属性或函数
 * @returns
 */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action
  };
};

export const createUpdateQueue = <Action>() => {
  return {
    shared: {
      pending: null
    }
  } as UpdateQueue<Action>;
};
