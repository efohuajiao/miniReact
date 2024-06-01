export type Container = Element;
export type Instance = Element;

/**
 * 创建DOM节点
 * @param type
 * @param props
 * @returns
 */
export const createInstance = (type: string, props: any): Instance => {
  // TODO 处理props
  const element = document.createElement(type);
  return element;
};

export const appendInitialChild = (parent: Instance | Container, child: Instance) => {
  parent.append(child);
};

/**
 * 创建TEXT DOM节点
 * @param content
 * @returns
 */
export const createTextInstance = (content: string) => {
  return document.createTextNode(content);
};

export const appendChildToContainer = appendInitialChild;
