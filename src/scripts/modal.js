const layout = document.querySelector('.layout');
const modal = document.querySelector('.modal');
const cameras = document.querySelector('.camera');

cameras.forEach(camera => camera.addEventListener('click', onModalToggle));

function onModalClose(event) {
  if (event.target !== this) return;

  onModalToggle(event, this.closest('.modal').dataset.type);
}

function onModalToggle(event) {
  event.preventDefault();

  const hiddenClass = 'modal--hidden';
  const hasModalOpen = modal.classList.contains(hiddenClass);

  if (hasModalOpen) animateModal(event);

  document.body.classList.toggle('no-overflow');
  modal.classList.toggle(hiddenClass);
  modal.classList.toggle('modal--opened');

  layout.classList.toggle('layout--with-modal');
}

function animateModal(event) {
  const { top, left, width, height } = event.target.closest('.card').getBoundingClientRect();
  const { clientWidth, clientHeight } = document.documentElement;

  const centerX = clientWidth / 2;
  const centerY = clientHeight / 2;

  const resultLeft = left + (width / 2) - centerX;
  const resultTop = top + (height / 2) - centerY;

  document.documentElement.style.setProperty('--modal-start-transform', `translate(${resultLeft}px, ${resultTop}px) scale(0.2)`);
}
