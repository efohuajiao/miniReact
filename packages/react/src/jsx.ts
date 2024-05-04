import { REACT_ELEMENT_TYPE } from 'packages/shared/ReactSymbols';
import { ElementType, Key, Props, ReactElementType, Ref, Type } from 'packages/shared/ReactTypes';

// 生成ReactElement数据结构
const ReactElement = (type: Type, key: Key, ref: Ref, props: Props): ReactElementType => {
  const element: ReactElementType = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: 'Huajiao' // 源码中不存在，主要用于区分是否是真实react项目
  };
  return element;
};

/**
 *
 * @param type
 * @param config type对应的配置信息，比如元素的属性、children这些参数
 * @param maybeChildren
 */
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  let key: Key = null;
  const props: Props = {};
  let ref: Ref = null;

  // 将config的 key/val 赋值给props
  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }

    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }

  // 处理maybechildren的
  const maybeChildrenLength = maybeChildren.length;
  if (maybeChildrenLength) {
    if (maybeChildrenLength === 1) {
      props.children = maybeChildren[0];
    } else {
      props.children = maybeChildren;
    }
  }
  return ReactElement(type, key, ref, props);
};

/**
 *
 * @param type
 * @param config type对应的配置信息，比如元素的属性、children这些参数
 * @param maybeChildren
 */
export const jsxDEV = (type: ElementType, config: any) => {
  let key: Key = null;
  const props: Props = {};
  let ref: Ref = null;

  // 将config的 key/val 赋值给props
  for (const prop in config) {
    const val = config[prop];
    if (prop === 'key') {
      if (val !== undefined) {
        key = '' + val;
      }
      continue;
    }
    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val;
      }
      continue;
    }

    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val;
    }
  }

  return ReactElement(type, key, ref, props);
};
