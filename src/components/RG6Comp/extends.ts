import G6 from '@antv/g6';
import {
  NodeModalItem,
  ModelCfg,
  EdgeData,
  NodeData,
  GroupModel,
  NodeShape,
  Point,
  Item,
  BehiverConfig,
} from './index.d';
import { raGroupConfig, raNodeConfig, raGroupDragBehivor } from './initData';
const [nodeWidth, nodeHeight] = [150, 40];
interface addShapProps {
  cfg: ModelCfg;
  group: GroupModel;
  config: NodeShape;
  faPos: Point;
  thisObj: any;
  anchorIndex?: number;
}
function addShaps({
  cfg,
  group,
  config,
  faPos = { x: 0, y: 0 },
  thisObj,
  anchorIndex,
}: addShapProps): any {
  const { x: fax, y: fay } = faPos;
  const { x = 0, y = 0, style = {}, name, innerShaps, base } = config || {};
  const currPos = {
    x: fax,
    y: fay,
  };
  if (typeof x === 'number') {
    currPos.x += x;
  } else if (typeof x === 'function') {
    currPos.x += x(cfg, thisObj.grap, anchorIndex);
  }

  if (typeof y === 'number') {
    currPos.y += y;
  } else if (typeof y === 'function') {
    currPos.y += y(cfg, thisObj.grap, anchorIndex);
  }

  const attrs: { [key: string]: any } = {};

  Object.keys(style).forEach((key: string) => {
    const value = style[key];
    if (typeof value === 'function') {
      attrs[key] = value(cfg, thisObj.grap, anchorIndex);
    } else {
      attrs[key] = value;
    }
  });
  const keyShape = group?.addShape(base, {
    name,
    attrs: {
      ...attrs,
      ...currPos,
    },
  });
  if (Array.isArray(innerShaps) && innerShaps.length) {
    innerShaps.forEach(shap => {
      addShaps({
        cfg,
        group,
        config: shap,
        faPos,
        thisObj,
        anchorIndex,
      });
    });
  }
  return keyShape;
}

export function registerNodeFun(modelConfig: NodeModalItem) {
  const { type, shap, anchorPoints = {} as any, adjustNode, onStateChange } = modelConfig;
  G6.registerNode(type, {
    draw(cfg: ModelCfg, group: GroupModel) {
      const keyShape = addShaps({
        cfg,
        group,
        config: shap as any,
        faPos: { x: 0, y: 0 },
        thisObj: this,
      });
      // 绘制锚点
      this.drawAnchorPoints(cfg, group);
      return keyShape;
    },
    update(cfg: ModelCfg, item: Item) {
      const group = item.getContainer();
      // 初始化 children 的相对坐标
      addShaps({
        cfg,
        group,
        config: shap as any,
        faPos: { x: 0, y: 0 },
        thisObj: this,
      });
      // 绘制锚点
      this.drawAnchorPoints(cfg, group);
      if (cfg) {
        this.adjustNode(cfg, group);
      }
    },
    afterDraw(cfg: ModelCfg, group: GroupModel) {
      if (cfg) {
        this.adjustNode(cfg, group);
      }
    },
    setState(name: string | undefined, value: string | boolean | undefined, item: Item) {
      const group = item.getContainer();
      const cfg = item.getModel();
      onStateChange && onStateChange(item, cfg, group.getChildren(), this.graph);
    },
    adjustNode(cfg: ModelCfg, group: GroupModel) {
      if (adjustNode) {
        adjustNode(cfg, group.getChildren(), this.graph);
      }
    },
    drawAnchorPoints(cfg: ModelCfg, group: GroupModel) {
      const { width = 0, height = 0 } = (cfg || {}) as any;
      const anchorPointList = (this as any).getAnchorPoints();
      if (anchorPoints) {
        anchorPointList?.forEach((point: number[], index: number) => {
          const aShap = anchorPoints.shape || {
            base: 'circle',
            style: {
              r: 3,
              stroke: '#9fa7c7',
              fill: '#fff',
              cursor: 'pointer',
              lineWidth: 1,
              lineDash: false,
            },
            x: 0,
            y: 0,
          };
          aShap.name = 'anchor_' + index;
          addShaps({
            cfg,
            group,
            config: aShap as any,
            faPos: { x: point[0] * width, y: point[1] * height },
            thisObj: this,
            anchorIndex: index,
          });
        });
      }
    },
    // 指定锚点
    getAnchorPoints(): number[][] | undefined {
      if (anchorPoints === false) return undefined;
      if (anchorPoints === true || anchorPoints === undefined)
        return [
          [0.5, 0],
          [0.5, 1],
        ];
      return anchorPoints.positions
        ? anchorPoints.positions
        : [
            [0.5, 0],
            [0.5, 1],
          ];
    },
  });
}

// 注册交互的方法
export function registerBehiverFun(behiverConfig: BehiverConfig) {
  const { events } = behiverConfig;
  const keys = Object.keys(events);
  const funMap: { [key: string]: (event: any) => void } = {};
  const eventsMap: { [key: string]: string } = {};
  keys.forEach((key, index) => {
    const funName = `fun_${index}`;
    eventsMap[key] = funName;
    funMap[funName] = events[key];
  });
  G6.registerBehavior(behiverConfig.name, {
    getEvents: function getEvents() {
      return eventsMap;
    },
    ...funMap,
  });
}
// 对数据布局

registerNodeFun(raGroupConfig);

registerNodeFun(raNodeConfig);

registerBehiverFun(raGroupDragBehivor);

export default G6;
