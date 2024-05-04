import { Key, Props, Ref } from 'packages/shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';

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
  alternate: FiberNode | null;
  flags: Flags;

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

    this.alternate = null; // 用于在current和workInProgress两棵fiber树之间进行切换

    // 副作用，表达当前fiberNode是要更新还是删除
    this.flags = NoFlags;
  }
}
