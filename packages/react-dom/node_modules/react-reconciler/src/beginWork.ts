import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';

// 递归中的递阶段
export const beginWork = (wip: FiberNode) => {
  // 比较，返回子fiberNode
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
    default:
      if (__DEV__) {
        console.warn('beginWork为实现的类型');
      }
      return null;
  }
};

/**
 * 更新HostRoot类型，多数情况下是<App />ReactElement
 * @param wip
 * @returns
 */
function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState; // 首屏渲染memoizedState不存在
  const updateQueue = wip.updateQueue as UpdateQueue<Element>;
  const pending = updateQueue.shared.pending; // 获取到更新队列
  updateQueue.shared.pending = null; // 更新队列已经开始更新，因此设为null
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren); // 创建子fiberNode
  return wip.child;
}

/**
 * 更新HostComponent <div> <span> </span> </div>
 * @param wip
 */
function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps;
  const nextChildren = nextProps.children;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function reconcileChildren(wip: FiberNode, chilren?: ReactElementType) {
  const current = wip.alternate;

  // 首屏渲染下hostRootFiber在prepareFreshStack时创建了wip，因此也存在current和wip两颗树
  // 会走update阶段，因此只会执行一次Placement操作进行优化
  if (current !== null) {
    //update阶段
    wip.child = reconcileChildFibers(wip, current?.child, chilren);
  } else {
    // mount阶段
    wip.child = mountChildFibers(wip, null, chilren);
  }
}
