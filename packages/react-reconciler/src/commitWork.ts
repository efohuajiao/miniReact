import { Container, appendChildToContainer } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

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
        commitMutationEffectsOnFiber(nextEffect);
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
const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
  // 1. 获取fiber的flags
  // 2. 判断不同的更新操作,PlaceMent、Update、ChildDeletion，随后清除对应的flags
  const flags = finishedWork.flags;

  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork);
    // 执行完placement后去除fiber上对应的palcement  flags
    finishedWork.flags &= ~Placement;
  }

  // flags update

  // flags ChildDeletion
};

/**
 * 执行placement操作
 * @param finishedWork
 */
const commitPlacement = (finishedWork: FiberNode) => {
  // parent DOM
  // finishedWork -> DOM

  if (__DEV__) {
    console.warn('执行Plaecment操作', finishedWork);
  }

  // 获取父级节点的DOM
  const hostParent = getHostParent(finishedWork);

  // 找到finishedWork的DOM并append到hostParent中
  appendPalcementNodeIntoContainer(finishedWork, hostParent);
};

/**
 * 获取父级节点
 * @param fiber
 * @returns
 */
function getHostParent(fiber: FiberNode) {
  let parent = fiber.return;

  while (parent) {
    const parentTag = parent.tag;

    // 如果父级节点是hostComponent
    if (parentTag === HostComponent) {
      return parent.stateNode as Container;
    }
    if (parentTag === HostRoot) {
      // 根节点的DOM存储在stateNode的container里
      return (parent.stateNode as FiberRootNode).container;
    }

    parent = parent.return;
  }

  if (__DEV__) {
    console.warn('未找到父节点');
  }
}

/**
 * 将节点插入到父节点中
 * @param finishedWork
 * @param hostParent
 * @returns
 */
function appendPalcementNodeIntoContainer(finishedWork: FiberNode, hostParent: Container) {
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(finishedWork.stateNode, hostParent);
    return;
  }

  let child = finishedWork.child;
  // 向下递归遍历，获取到tag是HostComponent或HostText的fiber，将其append到hostParent中
  if (child !== null) {
    appendChildToContainer(child, hostParent);
    let sibling = child.sibling;

    while (sibling !== null) {
      appendChildToContainer(sibling, HostComponent);
      sibling = sibling.sibling;
    }
  }
}
