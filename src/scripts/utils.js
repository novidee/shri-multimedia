const getTransformToCenter = (node) => {
  const { clientWidth, clientHeight } = document.documentElement;
  const viewportCenter = {
    x: clientWidth / 2,
    y: clientHeight / 2
  };

  const { clientWidth: nodeWidth, clientHeight: nodeHeight } = node;
  const nodeCenter = {
    x: node.offsetLeft + nodeWidth / 2,
    y: node.offsetTop + nodeHeight / 2
  };

  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  return {
    x: viewportCenter.x - nodeCenter.x,
    y: viewportCenter.y - nodeCenter.y + scrollTop,
    scale: Math.min(clientWidth / nodeWidth, clientHeight / nodeHeight)
  };
};

const calculateLightness = (pixels, index) => (
  (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3
);

const throttle = (func, ms) => {
  let isThrottled = false;
  let savedArgs;
  let savedThis;

  function wrapper(...args) {
    if (isThrottled) {
      savedArgs = args;
      savedThis = this;
      return;
    }

    func.apply(this, args);

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = null;
        savedThis = null;
      }
    }, ms);
  }

  return wrapper;
};

export {
  getTransformToCenter,
  calculateLightness,
  throttle
};
