import { FiberNode } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';

let nextEffect: FiberNode | null = null;

/**
 * 执行commit阶段对应的操作，如Placement、Updae、ChildDeletion
 * @param finishedWork
 */
export const commitMutationEffect = (finishedWork: FiberNode) => {
  nextEffect = finishedWork;
  // 向下遍历
  while (nextEffect !== null) {
    const child = nextEffect.child;
    // 当前fiber树存在subtreeFlags，即它的孩子节点存在需要进行更新的操作，并且孩子节点不为null
    if ((nextEffect.subTreeFlags & MutationMask) !== NoFlags && child !== null) {
      nextEffect = child;
    } else {
      // 遍历到叶子节点或者当前fiebr树不存在subtreeFlags，此时处理fiber树本身的flags
      // 向上遍历
      up: while (nextEffect !== null) {
        commitMutationeffectsOnFiber(nextEffect);
        // 遍历兄弟节点
        const sibling: FiberNode | null = nextEffect.sibling;
        if (sibling !== null) {
          nextEffect = sibling;
          break up;
        }
      }
      // 兄弟节点遍历完向上遍历父节点
      nextEffect = nextEffect.return;
    }
  }
};

/**
 * 处理fiber存在flags的情况
 * @param nextEffect
 */
const commitMutationeffectsOnFiber = (nextEffect: FiberNode) => {
  // 1. 获取fiber的flags
  // 2. 判断不同的更新操作,PlaceMent、Update、ChildDeletion，随后清除对应的flags
};
