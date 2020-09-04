import React, { useRef, useEffect } from 'react';
import RG6Group from '@/components/RG6Group';
import { raGroupConfig } from '@/components/RG6Group/mock';
import { getMockNodesAndEdges } from './__mock__/nodeData';
const data = {
  // 点集
  nodes: [
    {
      id: 'node1', // String，该节点存在则必须，节点的唯一标识
      label: 'node1',
      // type: 'RaGroupDemo',
      x: 100, // Number，可选，节点位置的 x 值
      y: 200, // Number，可选，节点位置的 y 值
      children: [
        {
          id: 'node1-1',
          label: 'node1-1',
        },
        {
          id: 'node1-2',
          label: 'node1-2',
        },
        {
          id: 'node1-3',
          label: 'node1-3',
        },
      ],
    },
    {
      id: 'node2', // String，该节点存在则必须，节点的唯一标识
      label: 'node2',
      status: 'done',
      // type: 'RaGroupDemo',
      x: 300, // Number，可选，节点位置的 x 值
      y: 200, // Number，可选，节点位置的 y 值
      children: [
        {
          id: 'node2-1',
          label: 'node2-1',
        },
        {
          id: 'node2-2',
          label: 'node2-2',
        },
      ],
    },
    {
      id: 'node3', // String，该节点存在则必须，节点的唯一标识
      label: 'node3',
      x: 200, // Number，可选，节点位置的 x 值
      y: 100, // Number，可选，节点位置的 y 值
      children: [
        {
          id: 'node3-1',
          label: 'node3-1',
        },
        {
          id: 'node3-2',
          label: 'node3-2',
        },
        {
          id: 'node3-3',
          label: 'node3-3',
        },
      ],
    },
    {
      id: 'node4', // String，该节点存在则必须，节点的唯一标识
      label: 'node4',
      x: 200, // Number，可选，节点位置的 x 值
      y: 100, // Number，可选，节点位置的 y 值
      children: [
        {
          id: 'node4-1',
          label: 'node4-1',
        },
        {
          id: 'node4-2',
          label: 'node4-2',
        },
        {
          id: 'node4-3',
          label: 'node4-3',
        },
      ],
    },
  ],
  // 边集
  edges: [
    {
      source: 'node1-2', // String，必须，起始点 id
      target: 'node2-1', // String，必须，目标点 id
    },
    {
      source: 'node1-1', // String，必须，起始点 id
      target: 'node3-2', // String，必须，目标点 id
    },
    {
      source: 'node3-2', // String，必须，起始点 id
      target: 'node4-1', // String，必须，目标点 id
    },
    {
      source: 'node2-2', // String，必须，起始点 id
      target: 'node4-2', // String，必须，目标点 id
    },
    {
      source: 'node2-1', // String，必须，起始点 id
      target: 'node4-1', // String，必须，目标点 id
    },
  ],
};
export default function() {
  // const { nodes, edges } = getMockNodesAndEdges(1000, 500);
  // console.log(114, nodes, edges);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <RG6Group
        nodes={data.nodes}
        edges={data.edges}
        // nodeConfigs={[raGroupConfig]}
      />
    </div>
  );
}
