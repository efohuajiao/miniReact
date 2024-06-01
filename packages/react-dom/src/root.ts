// ReactDOM.cerateRoot(root).render(<App />);

import { createContaienr, updateContainer } from 'react-reconciler/src/fiberReconciler';
import { Container } from './hostConfig';
import { ReactElementType } from 'shared/ReactTypes';

/**
 * 在react-dom用于创建根Node节点
 * @param container
 * @returns
 */
export function createRoot(container: Container) {
  const root = createContaienr(container);

  return {
    render(element: ReactElementType) {
      updateContainer(element, root);
    }
  };
}
