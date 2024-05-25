export type Flags = number;

export const NoFlags = 0b0000001;
/**
 * 表示节点插入
 */
export const Placement = 0b0000010;
/**
 * 表示更新属性
 */
export const Update = 0b0000100;
/**
 * 表示节点删除
 */
export const ChldDeletion = 0b0001000;

export const MutationMask = Placement | Update | ChldDeletion;
