import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

/**
 * 是否追踪副作用
 * @param shouldTrackEffects
 * @returns
 */
function ChildReconciler(shouldTrackEffects: boolean) {
  return function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: ReactElementType
  ) {
    // 调度单个reactElement
    function reconcileSingleElement(
      returnFiber: FiberNode,
      currentFiber: FiberNode | null,
      element: ReactElementType
    ) {
      // 根据ReactElement创建FIber
      const fiber = createFiberFromElement(element);
      fiber.return = returnFiber; // 将创建的fiber与它的父fiber节点绑定
      return fiber;
    }

    function reconcileSingleTextNode(
      returnFiber: FiberNode,
      currentFiber: FiberNode | null,
      content: string | number
    ) {
      const fiber = new FiberNode(HostText, { content }, null);
      fiber.return = returnFiber;
      return fiber;
    }

    function placeSingleChild(fiber: FiberNode) {
      // 应该追踪副作用且首屏渲染
      if (shouldTrackEffects && fiber.alternate === null) {
        fiber.flags |= Placement;
      }
      return fiber;
    }

    // 判断当前fiber的类型
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFiber, newChild));
        default:
          if (__DEV__) {
            console.warn('为实现的reconcile类型', newChild);
          }
      }
    }
    // TODO 多节点情况 ul > li*3

    //HostText
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFiber, newChild));
    }

    if (__DEV__) {
      console.warn('为实现的reconcile类型', newChild);
    }
    return null;
  };
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
