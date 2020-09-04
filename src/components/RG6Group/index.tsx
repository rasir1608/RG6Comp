import React from 'react';
import { RG6Props, GrapConfig, GraphDataType } from './interface';
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
    const { grapConfig = {}, onLoad, nodeConfigs } = this.props;
    const { nodeCfg, dagreCfg, toolTip, ...grapRestCfg } = grapConfig as any;
    const g6Config = getDefaultConfig(
      (this as any).g6Wrap,
      grapRestCfg,
    ) as GrapConfig;
    if (Array.isArray(nodeConfigs) && nodeConfigs.length) {
      nodeConfigs.forEach(cfg => {
        registerNodeFun(cfg);
      });
    }
    const minimap = new G6.Minimap({
      className: 'g6-minimap',
    });
    g6Config.plugins = [minimap];
    const graph = new G6.Graph(g6Config);
    graph.read({ nodes: [], edges: [] });
    this.setState({ graph }, this.flushGraph);
    onLoad && onLoad(graph, this.graphInst);
  }

  componentDidUpdate(props: RG6Props) {
    if (props.nodes !== this.props.nodes || props.edges !== this.props.edges) {
      this.flushGraph();
    }
  }
  graphInst = {};

  flushGraph = () => {
    const { grapConfig = {}, nodes, edges } = this.props;
    const { nodeCfg, dagreCfg } = grapConfig as any;
    const { graph } = this.state;
    if (!graph) return;
    arrangmenNodeData(nodes, {
      nodeWidth: nodeCfg?.nodeWidth,
      nodeHeight: nodeCfg?.nodeHeight,
      padding: nodeCfg?.nodePadding,
    });
    const datas = getAutoLayout(nodes, edges, {
      nodesep: dagreCfg?.nodesep,
      ranksep: dagreCfg?.ranksep,
      rankdir: dagreCfg?.rankdir,
      align: dagreCfg?.align,
    });
    (graph as any).changeData(datas);
    (graph as any).findAll('node', (node: any) => {
      if (node.getModel().isGroup) {
        node.toBack();
      }
      return true;
    });
    (graph as any).fitView(20);
  };

  render() {
    return (
      <div
        className="r-g6-wrap"
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
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
