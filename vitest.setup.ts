import '@testing-library/jest-dom/vitest';
import { server } from './src/_tosslib/server/node';
import { resetData } from './src/_tosslib/server/handlers';
import { beforeAll, afterAll, afterEach } from 'vitest';

// Canvas mock for lottie-web
HTMLCanvasElement.prototype.getContext = (() => {
  return {
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (_x: number, _y: number, w: number, h: number) => ({
      data: new Array(w * h * 4),
    }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
  };
}) as any;

HTMLCanvasElement.prototype.toDataURL = () => '';

// happy-dom does not implement window.confirm — stub it so vi.spyOn can override it per test
window.confirm = () => false;

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});
afterEach(() => {
  server.resetHandlers();
  resetData();
});
afterAll(() => {
  server.close();
});
