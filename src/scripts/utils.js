const getTransformToCenter = (node) => {
  const { clientWidth, clientHeight, scrollTop } = document.documentElement;
  const viewportCenter = {
    x: clientWidth / 2,
    y: clientHeight / 2
  };

  const { clientWidth: nodeWidth, clientHeight: nodeHeight } = node;
  const nodeCenter = {
    x: node.offsetLeft + nodeWidth / 2,
    y: node.offsetTop + nodeHeight / 2
  };

  return {
    x: viewportCenter.x - nodeCenter.x,
    y: viewportCenter.y - nodeCenter.y + scrollTop,
    scale: Math.min(clientWidth / nodeWidth, clientHeight / nodeHeight)
  };
};

export {
  getTransformToCenter
};
