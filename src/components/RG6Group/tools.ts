import dagre from 'dagre';
import { EdgeData, NodeData } from './interface';
const nodesMap: any = {};
const edgesMap: any = {};
const [defaultNW, defaultNH, defaultPd] = [150, 40, 10];
type Nwd = { nodeWidth?: number; nodeHeight?: number; padding?: number };
// 节点宽高添加
export function fixWH(
  nodeModel: any,
  { nodeWidth = defaultNW, nodeHeight = defaultNH, padding = defaultPd }: Nwd,
) {
  const { children, width, height, titleWidth, titleHeight } = nodeModel;
  if (Array.isArray(children)) {
    let childNum = 1;
    childNum = children.length || 1;
    if (height === undefined)
      nodeModel.height = nodeHeight * (childNum + 1) + (childNum + 3) * padding;
  } else {
    if (height === undefined) nodeModel.height = nodeHeight;
  }
  if (width === undefined) nodeModel.width = nodeWidth;
  if (titleWidth === undefined) nodeModel.titleWidth = nodeModel.width;
  if (titleHeight === undefined) nodeModel.titleHeight = nodeHeight;
}
// 自动布局
export function getAutoLayout(
  nodes: NodeData[] = [],
  edges: EdgeData[] = [],
  cfg: any = {},
) {
  if (nodes.length === 0)
    return {
      nodes: [],
      edges: [],
    };
  const polyEdges = getPolyEdges(nodes, edges);
  const { nodes: dagreNodes } = getDagreLayout(nodes, polyEdges, cfg);
  const childNodes: NodeData[] = [];
  const { padding = defaultPd } = cfg;
  dagreNodes.forEach(({ children, x: fax, y: fay, titleHeight }) => {
    if (Array.isArray(children) && children.length) {
      let totalPadding = titleHeight;
      children.forEach(node => {
        totalPadding += padding;
        node.x = fax + padding;
        node.y = fay + totalPadding;
        totalPadding += node.height;
        childNodes.push(node);
      });
    }
  });
  return {
    nodes: [...nodes, ...childNodes],
    edges: edges.map(e => ({ ...e, sourceAnchor: 1, targetAnchor: 0 })),
  };
}
// dagre布局
export function getDagreLayout(
  nodes: NodeData[] = [],
  edges: EdgeData[] = [],
  {
    nodesep = defaultNW, // 可选
    ranksep = defaultNW, // 可选
    rankdir = 'LR',
    align = 'UL',
  },
): { nodes: NodeData[]; edges: EdgeData[] } {
  if (nodes.length === 0)
    return {
      nodes: [],
      edges: [],
    };
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir, // 可选，默认为图的中心
    align, // 可选
    nodesep,
    ranksep,
  });
  g.setDefaultEdgeLabel(function() {
    return {};
  });
  nodes.forEach((node: NodeData) => g.setNode(node.id, node));
  edges.forEach((edge: EdgeData) => g.setEdge(edge.source, edge.target));
  dagre.layout(g);
  return {
    nodes: nodes.map(node => ({
      ...node,
      ...g.node(node.id),
    })),
    edges: edges.map((e: EdgeData) => ({ source: e.source, target: e.target })),
  };
}

// 聚合连线
function getPolyEdges(nodes: NodeData[], edges: EdgeData[]): EdgeData[] {
  const childList: { [key: string]: string } = {};
  nodes?.forEach(({ children, id: fid }) => {
    children?.forEach(({ id: cid }: { id: string }) => {
      childList[cid] = fid;
    });
  });
  const edgeObj: { [key: string]: EdgeData } = {};
  edges?.forEach(edge => {
    const { source, target } = edge;
    if (!source || !target) {
      return new Error('edges error');
    }
    edgesMap[`${source}_${target}`] = edge;
    const key = `${childList[source]}_${childList[target]}`;
    if (!edgeObj[key]) {
      edgeObj[key] = {
        source: childList[source],
        target: childList[target],
      };
      edgesMap[key] = edgeObj[key];
    }
  });
  return Object.values(edgeObj);
}

// 整理数据
export function arrangmenNodeData(
  nodes: NodeData[] = [],
  nwd: Nwd = {},
  preNode?: any,
) {
  nodes?.forEach(node => {
    let isGroup = node.isGroup;
    if (isGroup === undefined) {
      isGroup = Array.isArray(node.children);
    }
    let type = node.type;
    if (type === undefined) {
      type = isGroup ? 'RaGroup' : 'RaNode';
    }
    let cfg = { ...nwd };
    if (preNode) {
      cfg.nodeWidth = preNode.width
        ? preNode.width - (cfg.padding || defaultPd) * 2
        : undefined;
      node.gid = preNode.id;
    }
    node.type = type;
    node.isGroup = isGroup;
    nodesMap[node.id] = node;
    fixWH(node, cfg);
    if (Array.isArray(node.children)) {
      arrangmenNodeData(node.children, nwd, node);
    }
  });
}
