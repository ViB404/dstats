export interface Adapter {
  onReady(callback: () => void): void;
}
