import { Key, Props, Ref } from 'packages/shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
  type: any;
  tag: WorkTag;
  pendingProps: Props;
  key: Key;
  stateNode: any;
  ref: Ref;

  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;

  memoizedProps: Props | null;
  memoizedState: any;
  alternate: FiberNode | null;
  flags: Flags;

  updateQueue: unknown; // 更新队列

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // 实例属性
    this.tag = tag;
    this.key = key;
    this.stateNode = null; // HostComponent <div>类型 stateNode为div
    this.type = null; // fiberNode的类型

    // 构成树状结构
    this.return = null; // 指向父fiberNode
    this.sibling = null; // 指向同级fiberNode
    this.child = null; // 指向子fiberNode
    this.index = 0; // 多个同级fiberNode下自身的索引
    this.ref = null;

    // 作为工作单元
    this.pendingProps = pendingProps; // 工作前的Props
    this.memoizedProps = null; // 工作完后的Props
    this.memoizedState = null; //工作完后的State
    this.alternate = null; // 用于在current和workInProgress两棵fiber树之间进行切换
    this.updateQueue = null; // 更新队列

    // 副作用，表达当前fiberNode是要更新还是删除
    this.flags = NoFlags;
  }
}

// 用于存储ReactDom.cerateRoot对应的根节点
export class FiberRootNode {
  container: Container; // 保存当前宿主环境
  current: FiberNode; // 指向hostRootFiber容器
  finishedWork: FiberNode | null; // 指向更新完成后的hostRootFIber
  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container;
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    this.finishedWork = null;
  }
}

/**
 * 创建workInProgress,双缓冲机制，创建两颗workInProgress用于后续更新比较
 * @param current
 * @param pendingProps
 * @returns
 */
export const createWorkInProgress = (current: FiberNode, pendingProps: Props): FiberNode => {
  let wip = current.alternate;

  if (wip === null) {
    // 首屏渲染时alternate为null
    // mount
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;
    wip.alternate = current.alternate;
    current.alternate = wip;
  } else {
    // update
    wip.pendingProps = pendingProps;
    wip.flags = NoFlags;
  }

  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;

  return wip;
};
