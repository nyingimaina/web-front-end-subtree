import { IResponsiveTableColumnDefinition } from "jattac.libs.web.responsive-table";

function GetRowNumberColumn<TData>(args?: {
  page: number;
  pageSize: number;
}): (
  data: TData,
  rowIndex?: number
) => IResponsiveTableColumnDefinition<TData> {
  return (_data, rowIndex = 0) => {
    const rowNumber = args
      ? (args.page - 1) * args.pageSize + rowIndex + 1
      : rowIndex + 1;
    return {
      cellRenderer: () => (
        <div style={{ textAlign: "right" }}>
          {rowNumber.toLocaleString().padStart(2, "0")}.
        </div>
      ),
      displayLabel: <div style={{ textAlign: "right" }}>#</div>,
    };
  };
}

export { GetRowNumberColumn };
