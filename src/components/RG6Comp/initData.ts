import { NodeModalItem, BehiverConfig, Point } from './index.d';
const [nodeWidth, nodeHeight, padding] = [150, 40, 10];
export const raGroupConfig: NodeModalItem = {
  type: 'RaGroup',
  anchorPoints: false,
  shap: {
    base: 'rect',
    name: 'groupWrap',
    style: {
      width: ({ width }) => width,
      height: ({ height }) => height,
      fill: '#fff',
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowBlur: 10,
      lineWidth: 1,
    },
    x: 0,
    y: 0,
    innerShaps: [
      {
        base: 'rect',
        name: 'groupTitle',
        style: {
          width: ({ titleWidth }) => titleWidth,
          height: ({ titleHeight }) => titleHeight,
          stroke: '#9fa7c7',
          fill: '#eef4ff',
          lineWidth: 1,
        },
        x: 0,
        y: 0,
        innerShaps: [
          {
            base: 'text',
            name: 'label',
            x: 10,
            y: ({ titleHeight }) => titleHeight / 2 + 5,
            style: {
              fill: '#333',
              text: node => {
                return node.label || '';
              },
            },
          },
        ],
      },
      {
        base: 'rect',
        name: 'childWrap',
        style: {
          width: ({ titleWidth }) => titleWidth,
          height: ({ titleHeight, height }) => height - titleHeight + 1,
          fill: '#fff',
          stroke: '#9fa7c7',
          shadowBlur: 10,
          lineWidth: 1,
        },
        x: 0,
        y: ({ titleHeight }) => titleHeight - 1,
      },
    ],
  },
};
export const raNodeConfig: NodeModalItem = {
  type: 'RaNode',
  anchorPoints: {
    positions: [
      [0, 0.5],
      [1, 0.5],
    ],
    shape: {
      base: 'circle',
      name: 'anchor',
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
    },
  },
  shap: {
    base: 'rect',
    name: 'nodeWrap',
    style: {
      width: ({ width }) => width,
      height: ({ height }) => height,
      fill: 'transparent',
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowBlur: 10,
      lineWidth: 1,
    },
    x: 0,
    y: 0,
    innerShaps: [
      {
        base: 'rect',
        name: 'background',
        style: {
          width: ({ width }) => width,
          height: ({ height }) => height,
          stroke: '#9fa7c7',
          fill: '#eef4ff',
          lineWidth: 1,
        },
        x: 1,
        y: 1,
        innerShaps: [
          {
            base: 'text',
            name: 'label',
            x: 10,
            y: ({ height }) => height / 2 + 5,
            style: {
              fill: '#333',
              text: node => {
                return node.label || '';
              },
            },
          },
        ],
      },
    ],
  },
};

export const raGroupDragBehivor: BehiverConfig = {
  name: 'ra-group-drag',
  events: {
    mousedown: function(event) {
      const { target, x, y, item } = event;
      if (item) {
        const isEdge = !!item.getSource;
        this.offsetPoint = { x, y } as any;
        if (!isEdge) {
          this.dragNode = item;
        }
      }
    },
    mousemove: function(event) {
      if (this.dragNode) {
        const { x, y } = event;
        let gmodel = (this.dragNode as any).getModel();
        const offset = {
          x: (this.offsetPoint as any).x - x,
          y: (this.offsetPoint as any).y - y,
        };
        if (!gmodel.isGroup) {
          const { gid } = gmodel;
          if (gid) {
            const parentItem = (this.graph as any).findById(gid);
            if (parentItem) gmodel = parentItem.getModel();
          }
        }
        gmodel.x -= offset.x;
        gmodel.y -= offset.y;
        const { children } = gmodel;
        if (Array.isArray(children)) {
          children.forEach(child => {
            child.x -= offset.x;
            child.y -= offset.y;
          });
        }
        this.offsetPoint = { x, y } as any;
        (this.graph as any).refreshPositions();
      }
    },
    mouseup: function(event) {
      this.dragNode = undefined as any;
      this.offsetPoint = undefined as any;
      this.dragEdge = undefined as any;
    },
  },
};
