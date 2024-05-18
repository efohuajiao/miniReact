import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {}); // 根据hostRootFiber去创建对应的workInProgress
}

/**
 * 调度Fiber
 * @param fiber fiber数据结构
 */
export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // TODO调度功能
  const root = markUpdateFromFiberToRoot(fiber); // 从当前触发更新的fiebr向上便利获取到根节点fiberRootNode，随后开始更新流程
  renderRoot(root); // 开始更新
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;

  // 当前fiber是普通fiber
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }

  if (node.tag === HostRoot) {
    // 当node.parent为null，说明此时node是hostRotFiber,返回它的stateNode指针指向的FiberRootNode
    return node.stateNode;
  }
  return null; // 否则返回null
}

function renderRoot(root: FiberRootNode) {
  prepareFreshStack(root);

  // 开启dfs深度遍历fiberNode
  do {
    try {
      workLoop();
      break;
    } catch (e) {
      // 生产环境打印错误
      if (__DEV__) {
        console.error('workLoop发生错误', e);
      }
      workInProgress = null;
    }
  } while (true);

  // 通过beginWork和completeWork后，获取到了更新完成后的整颗fiber树
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;

  // 根据更新完的fiber树去创建对应的DOM
  commitRoot(root);
}

/**
 * 进行循环工作
 */
function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next: FiberNode | null = beginWork(fiber); // 获取子fiberNode
  fiber.memoizedProps = fiber.pendingProps; // 工作完后修改memoizedProps

  // 遍历到叶子节点，继续遍历兄弟节点或者返回父节点
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    // 否则继续向下遍历
    workInProgress = next;
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;

  do {
    completeWork(node);
    const sibling = node.sibling; // 获取兄弟节点

    // 有兄弟节点，遍历兄弟节点
    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }

    // 负责获取父节点继续遍历
    node = node.return;
    workInProgress = node;
  } while (node !== null);
}
