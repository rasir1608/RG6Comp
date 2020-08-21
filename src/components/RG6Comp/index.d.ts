// import { GraphOptions } from '@antv/g6/lib/interface/graph';
import { GraphData, NodeConfig, EdgeConfig, ModelConfig, GraphOptions } from '@antv/g6/lib/types';
import Edge from '@antv/g6/lib/item/edge';
import Node from '@antv/g6/lib/item/node';
import Group from '@antv/g-canvas/lib/group';
export type ModelCfg = ModelConfig & { [key: string]: any };
export type GroupModel = Group;
type EleType = 'node' | 'edge';
export interface GrapConfig extends GraphOptions {
  nodeCfg?: {
    nodeWidth?: number;
    nodeHeight?: number;
    nodePadding?: number;
  };
  dagreCfg?: {
    rankdir?: string; // 可选，默认为图的中心
    align?: string; // 可选
    nodesep?: number;
    ranksep?: number;
  };

  toolTip?: boolean | ((item: Item) => string);
  [key: string]: any;
}
export type GraphDataType = GraphData;
export type NodeItem = Node & { id: string };
export type EdgeItem = Edge & { source: string; target: string };
export type NodeData = {
  id: string;
  [key: string]: any;
};
export type EdgeData = { source: string; target: string; [key: string]: any };
export interface Grap {}
export interface GrapInst {}
export interface Point {
  x: number;
  y: number;
  [key: string]: any;
}
export type Item = NodeItem | EdgeItem;
type BaseValue =
  | boolean
  | string
  | number
  | ((node: ModelCfg, grap: Grap, anchorIndex?: number) => string | number);
type Style = { [key: string]: BaseValue };
type NodeShape = {
  base:
    | 'circle'
    | 'rect'
    | 'ellipse'
    | 'diamond'
    | 'triangle'
    | 'star'
    | 'image'
    | 'modelRect'
    | 'text';
  name?: string;
  text?: BaseValue;
  style?: Style;
  x?: number | ((node: ModelCfg, grap: Grap, anchorIndex?: number) => number); // 相对于父节点的位置x坐标
  y?: number | ((node: ModelCfg, grap: Grap, anchorIndex?: number) => number); // 相对于父节点的位置y坐标
  innerShaps?: NodeShape[];
};
export interface BehiverConfig {
  name: string;
  events: {
    [key: string]: (event: any) => void;
  };
}
type EdgeShape = {};

export interface NodeModalItem {
  type: string;
  shap?: NodeShape;
  adjustNode?: (node: ModelCfg, shaps: any[], grap: Grap) => void;
  onStateChange?: (nodeItem: Item, node: ModelCfg, shaps: any[], grap: Grap) => void;
  anchorPoints?:
    | boolean
    | {
        positions?: number[][];
        shape?: NodeShape;
      };
}

export interface EdgeModalItem {
  type?: string;
  style?: Style;
}

export interface RG6Props {
  onLoad?: (grap: Grap, inst: GrapInst) => void;
  nodeConfigs?: NodeModalItem[];
  edgeConfigs?: EdgeModalItem[];
  grapConfig?: GrapConfig;
  nodes?: NodeData[];
  edges?: EdgeData[];
  onChange?: (data: GraphDataType) => void;
  onSelect?: (type: EleType, current: Item, data: GraphDataType) => void;
  onDelete?: (type: EleType, current: Item, data: GraphDataType) => void;
}
