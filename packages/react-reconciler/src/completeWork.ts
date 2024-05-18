import { appendInitialChild, createInstance, createTextInstance } from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

// 递归中的归阶段
export const completeWork = (wip: FiberNode) => {
  const newProps = wip.pendingProps;
  const current = wip.alternate;

  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // 1.构建DOM
        const instace = createInstance(wip.type, newProps);
        // 2. 将DOM插入Dom树中
        appendALlChildren(instace, wip);
        wip.stateNode = instace;
      }
      bubleProperties(wip);
      return null;
    case HostText:
      // 1.构建DOM
      const instace = createTextInstance(newProps.content);
      // 2. 将DOM插入Dom树中
      appendALlChildren(instace, wip);
      wip.stateNode = instace;
      bubleProperties(wip);
      return null;
    case HostRoot:
      bubleProperties(wip);
      return null;
    default:
      if (__DEV__) {
        console.warn('未处理的completeWork情况', wip);
      }
  }
};

//将所有的children DOM插入到父DOM中
function appendALlChildren(parent: FiberNode, wip: FiberNode) {
  let node = wip.child;

  // 多个children需要进行递归插入
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node?.stateNode);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }

    // 递归遍历完成
    if (node === wip) {
      return;
    }

    // 兄弟节点的插入
    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return;
      }
      node = node.return;
    }

    node.sibling.return = node.return;
    node = node.sibling;
  }
}

/**
 * completeWork向上遍历，将当前节点的子节点以及子节点的兄弟节点包含的flags冒泡到当前节点的subtreeFlags
 * @param wip workInProgress树
 */
function bubleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = wip.child;
  while (child !== null) {
    subtreeFlags |= child.subTreeFlags;
    subtreeFlags |= child.flags;
    child.return = wip;
    child = child.sibling;
  }
  wip.subTreeFlags |= subtreeFlags;
}
