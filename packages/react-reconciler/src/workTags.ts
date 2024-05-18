export type WorkTag =
  | typeof FunctionComponent
  | typeof HostRoot
  | typeof HostComponent
  | typeof HostText;

export const FunctionComponent = 0;

/**
 * 表示根Fiber，由React.createElement创建
 */
export const HostRoot = 3;

/**
 * 表示原生DOM节点
 */
export const HostComponent = 5;
/**
 * 表示文本，即叶子节点
 */
export const HostText = 6;
