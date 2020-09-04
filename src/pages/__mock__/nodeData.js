function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const allEdgeNodes = [];

function getNodes(num, preNodeIndex) {
  return new Array(num).fill(null).map((_, i) => {
    const index = i + 1;
    const id = `node${preNodeIndex ? `${preNodeIndex}-${index}` : index}`;
    const node = {
      id,
      label: id,
      index,
      gIndex: preNodeIndex,
      children: preNodeIndex ? undefined : getNodes(getRandInt(1, 3), `${index}`),
    };
    if (preNodeIndex) allEdgeNodes.push(node);
    return node;
  });
}
function getEdges(num) {
  const allEdges = [];
  new Array(num).fill(null).forEach((_, i) => {
    const sourceIndex = getRandInt(0, allEdgeNodes.length - 1);
    let targetIndex = getRandInt(0, allEdgeNodes.length - 1);
    let count = 0;
    while (
      (allEdgeNodes[sourceIndex].gid === allEdgeNodes[targetIndex].gid ||
        allEdges.some(({ source, target }) => {
          const sourceId = allEdgeNodes[sourceIndex].id;
          const targetId = allEdgeNodes[targetIndex].id;
          return [source, target].some(id => [sourceId, targetId].includes(id));
        })) &&
      count <= allEdgeNodes.length / 2
    ) {
      targetIndex = getRandInt(0, allEdgeNodes.length - 1);
      count += 1;
    }
    const edge = { source: allEdgeNodes[sourceIndex].id, target: allEdgeNodes[targetIndex].id };
    allEdges.push(edge);
  });
  return allEdges;
}

export function getMockNodesAndEdges(nodeNum = 100, edgeNum = 20) {
  return {
    nodes: getNodes(nodeNum),
    edges: getEdges(edgeNum),
  };
}
