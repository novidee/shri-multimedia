const getTransformToCenter = (node: HTMLElement) => {
  const documentElement = document.documentElement;

  if (!documentElement) {
    return { x: 0, y: 0, scale: 1 };
  }

  const { clientWidth, clientHeight, scrollTop: documentScrollTop } = documentElement;
  const viewportCenter = {
    x: clientWidth / 2,
    y: clientHeight / 2,
  };

  const { clientWidth: nodeWidth, clientHeight: nodeHeight } = node;
  const nodeCenter = {
    x: node.offsetLeft + nodeWidth / 2,
    y: node.offsetTop + nodeHeight / 2,
  };

  const scrollTop = documentScrollTop || document.body.scrollTop;

  return {
    x: viewportCenter.x - nodeCenter.x,
    y: viewportCenter.y - nodeCenter.y + scrollTop,
    scale: Math.min(clientWidth / nodeWidth, clientHeight / nodeHeight),
  };
};

const calculateLightness = (pixels: Uint8ClampedArray, index: number) => (
  (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3
);

const throttle = (func: () => void, ms: number) => {
  let isThrottled = false;

  function wrapper() {
    if (isThrottled) {
      return;
    }

    func.apply(null);

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
    }, ms);
  }

  return wrapper;
};

export {
  getTransformToCenter,
  calculateLightness,
  throttle,
};
