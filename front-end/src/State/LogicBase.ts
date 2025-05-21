import ModuleStateManager from "module-state-manager";
import RepositoryBase from "./RepositoryBase";
import AsyncProxy from "@/AsyncProxy/AsyncProxy";

export default abstract class LogicBase<
  TRepository extends RepositoryBase,
  TModel extends object = {}
> extends ModuleStateManager<TRepository, TModel> {
  model = {} as TModel;
  protected proxyRunner = new AsyncProxy((busy) => {
    this.repository.busy = busy;
    this.rerender();
  });
}
