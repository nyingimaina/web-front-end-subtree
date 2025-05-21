export default abstract class ModuleStateManager<T> {
    protected abstract repository: T;
    protected rerender?: () => void;

    public setRerender(rerender: () => void): void {
        this.rerender = rerender;
    }

    public getState(): T {
        return this.repository;
    }
}
