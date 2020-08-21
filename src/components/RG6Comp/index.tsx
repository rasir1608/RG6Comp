import React from 'react';
import { RG6Props, GrapConfig, GraphDataType } from './index.d';
import G6, { registerNodeFun } from './extends';
import { arrangmenNodeData, getAutoLayout, getDagreLayout } from './tools';
import './index.less';

const getDefaultConfig = (wrapNode: HTMLElement, config?: GrapConfig) => ({
  container: wrapNode, // String | HTMLElement
  width: wrapNode.clientWidth, // Number，必须，图的宽度
  height: wrapNode.clientHeight, // Number，必须，图的高度
  autoPaint: true,
  fitView: true,
  groupByTypes: false,
  modes: {
    default: ['drag-canvas', 'zoom-canvas', 'ra-group-drag'],
  },
  defaultEdge: {
    type: 'cubic-horizontal',
    style: {
      lineWidth: 1,
      stroke: '#ccc',
      endArrow: {
        // 自定义箭头指向(0, 0)，尾部朝向 x 轴正方向的 path
        path: 'M 0,0 L 10,5 L 8,0 L 10,-5 Z',
        // 箭头的偏移量，负值代表向 x 轴正方向移动
        d: -3,
        // v3.4.1 后支持各样式属性
        fill: '#ccc',
        stroke: '#aaa',
        opacity: 0.8,
      },
    },
  },
  ...(config || {}),
});

class RG6Comp extends React.PureComponent<RG6Props, any, any> {
  state = {
    graph: null,
  };

  componentDidMount() {
    const { grapConfig = {}, onLoad, nodes, edges, nodeConfigs } = this.props;
    const { nodeCfg, dagreCfg, toolTip, ...grapRestCfg } = grapConfig as any;
    const g6Config = getDefaultConfig((this as any).g6Wrap, grapRestCfg);
    if (Array.isArray(nodeConfigs) && nodeConfigs.length) {
      nodeConfigs.forEach(cfg => {
        registerNodeFun(cfg);
      });
    }
    const graph = new G6.Graph(g6Config);
    arrangmenNodeData(nodes, {
      nodeWidth: nodeCfg?.nodeWidth,
      nodeHeight: nodeCfg?.nodeWidth,
      padding: nodeCfg?.nodePadding,
    });
    const datas = getAutoLayout(nodes, edges, {
      nodesep: dagreCfg?.nodesep,
      ranksep: dagreCfg?.ranksep,
      rankdir: dagreCfg?.rankdir,
      align: dagreCfg?.align,
    });
    graph.read(datas);
    graph.findAll('node', node => {
      if (node.getModel().isGroup) {
        node.toBack();
      }
      return true;
    });
    this.setState({ graph });
    onLoad && onLoad(graph, this.graphInst);
  }
  graphInst = {};

  render() {
    return (
      <div className="r-g6-wrap" style={{ width: '100%', height: '100%' }}>
        <div
          className="r-g6-comp"
          style={{ width: '100%', height: '100%' }}
          ref={c => ((this as any).g6Wrap = c)}
        ></div>
      </div>
    );
  }
}

export default RG6Comp;
