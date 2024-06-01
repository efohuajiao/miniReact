import reactDomConfig from "./react-dom.config";
import reactDom from './react.config'

export default () => {
    return [...reactDom, ...reactDomConfig]
}