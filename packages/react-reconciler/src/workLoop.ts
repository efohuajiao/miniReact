import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode } from './fiber';

let workInProgress: FiberNode | null = null;

function prepareFreshStack(fiber: FiberNode) {
  workInProgress = fiber;
}

function renderRoot(root: FiberNode) {
  prepareFreshStack(root);

  // 开启dfs深度遍历fiberNode
  do {
    try {
      workLoop();
      break;
    } catch (e) {
      console.error('workLoop发生错误', e);
      workInProgress = null;
    }
  } while (true);
}

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
    completeWork();
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
