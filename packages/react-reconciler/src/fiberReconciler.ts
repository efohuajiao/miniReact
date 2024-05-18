import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import { UpdateQueue, createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

/**
 * React用于创建根容器
 * @param container
 * @returns
 */
export function createContaienr(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  const root = new FiberRootNode(container, hostRootFiber);
  hostRootFiber.updateQueue = createUpdateQueue(); // 在根容器中创建更新队列
  return root;
}

/**
 * 用于首屏更新，创建hostRootFiber对应的update并将其加入updateQueue中
 * @param params
 */
export function updateContainer(element: ReactElementType | null, root: FiberRootNode) {
  const hostRootFiber = root.current; // 获取root的current指针指向的hostRootFiber
  const update = createUpdate<ReactElementType | null>(element); // 创建更新的数据结构update

  enqueueUpdate(hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>, update); // 将update入队列
  scheduleUpdateOnFiber(hostRootFiber); // 调度更新fiber
  return element;
}
