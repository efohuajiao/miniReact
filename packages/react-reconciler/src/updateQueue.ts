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

/**
 * 创建updateQueue
 * @returns
 */
export const createUpdateQueue = <State>() => {
  return {
    shared: {
      pending: null
    }
  } as UpdateQueue<State>;
};

/**
 * 将update加入队列
 * @param updateQueue
 * @param update
 */
export const enqueueUpdate = <State>(updateQueue: UpdateQueue<State>, update: Update<State>) => {
  updateQueue.shared.pending = update;
};

/**
 * 消费update
 * @param baseState
 * @param pendingUpdate
 * @returns
 */
export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null
): { memorizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = { memorizedState: baseState };

  if (pendingUpdate !== null) {
    const action = pendingUpdate.action;
    // 对应两种情况，一种传递函数，将baseState传入函数中进行更新
    // 另一种直接赋值
    if (action instanceof Function) {
      // baseState 1 update (x) => 2x  -> memorizedState 4
      result.memorizedState = action(baseState);
    } else {
      // baseState 1 update 2  -> memorizedState 2
      result.memorizedState = baseState;
    }
  }

  return result;
};
