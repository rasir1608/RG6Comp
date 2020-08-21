import { NodeModalItem } from './index.d';
const [nodeWidth, nodeHeight] = [150, 40];
export const raGroupConfig: NodeModalItem = {
  type: 'RaGroupDemo',
  anchorPoints: {
    positions: [
      [0.5, 0],
      [0.5, 1],
    ],
    shape: {
      base: 'rect',
      name: 'anchor',
      style: {
        width: 10,
        height: 10,
        stroke: '#f00',
        fill: '#fff',
      },
      x: -5,
      y: -5,
    },
  },
  shap: {
    base: 'rect',
    name: 'border',
    style: {
      width: nodeWidth,
      height: nodeHeight,
      stroke: '#f00',
      fill: '#fff',
      shadowColor: '#eee',
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
          width: nodeWidth - 2,
          height: nodeHeight - 2,
          stroke: '#00f',
          fill: '#00f',
          lineWidth: 1,
        },
        x: 1,
        y: 1,
        innerShaps: [
          {
            base: 'circle',
            name: 'status',
            style: {
              r: nodeHeight / 4,
              fill: node => {
                if (node.status === 'done') {
                  return '#f00';
                }
                return '#0f0';
              },
            },
            x: nodeHeight / 4 + 5,
            y: nodeHeight / 2,
          },
          {
            base: 'text',
            name: 'label',
            x: nodeHeight / 2 + 10,
            y: nodeHeight / 2 + 5,
            style: {
              fill: '#fff',
              text: node => {
                return (node.label || '').substr(0, 3);
              },
            },
          },
        ],
      },
    ],
  },
};
