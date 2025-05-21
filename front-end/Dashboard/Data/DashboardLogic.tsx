import LogicBase from "@/State/LogicBase";
import DashboardRepository from "./DashboardRepository";
import InvoiceApiService from "@/Invoices/Data/InvoiceApiService";
import Formatting from "@/Formatting";
import {
  IconExpense,
  IconIncome,
  IconInvoice,
  IconProfitOrLoss,
} from "@/IconsLibrary/Icons";
import ReportingHelper from "../../Reporting/ReportingHelper";
import InvoiceTypeNames from "@/Invoices/Data/InvoiceTypeNames";
import IDashboardCardData from "./IDashboardCardData";
import PaymentApiService from "@/Payments/Data/PaymentApiService";
import UnpaidInvoiceApiService from "@/UnpaidInvoices/Data/UnpaidInvoiceApiService";
import { FaBan, FaPercentage, FaPiggyBank } from "react-icons/fa";

export default class DashboardLogic extends LogicBase<DashboardRepository> {
  repository = new DashboardRepository();
  model = {};

  private get incomeSoFarTitle(): string {
    return "Income So Far";
  }

  private get expensesIncurredTitle(): string {
    return "Expenses Incurred";
  }

  private get amountBilledToCustomerTitle(): string {
    return "Amount Billed To Customers";
  }

  private get incomeAllTime(): string {
    return "Income All Time";
  }

  private get expensesWeOweTitle(): string {
    return "Expenses We Owe";
  }

  public async initializeAsync(): Promise<void> {
    await this.proxyRunner.runAsync(async () => {
      await Promise.all([
        this.fetchMonthInvoicesByType({ invoiceType: "Supplier", rank: 3 }),
        this.fetchMonthInvoicesByType({ invoiceType: "Customer", rank: 1 }),
        this.fetchThisMonthCustomerPaymentsAsync(),
        this.fetchAllTimeAmountOwed({
          rank: 1,
          invoiceType: "Customer",
        }),
        this.fetchAllTimeAmountOwed({
          rank: 2,
          invoiceType: "Supplier",
        }),
        this.fetchAllTimeCustomerPaymentsAsync(),
      ]);
    });
    this.calculateProfitOrLoss();
    this.repository.thisMonthCards.sort((a, b) => a.rank - b.rank);
    this.injectPlaceholderCards();
    this.repository.allTimeCards.sort((a, b) => a.rank - b.rank);
    this.rerender();
  }

  private get netProfitOrLoss(): number {
    const allTimeExpenses = this.repository.allTimeCards.find(
      (a) => a.title === this.expensesWeOweTitle
    );

    const allTimeIncome = this.repository.allTimeCards.find(
      (a) => a.title === this.incomeAllTime
    );
    if (allTimeExpenses && allTimeIncome) {
      return allTimeIncome.rawValue - allTimeExpenses.rawValue;
    } else {
      return 0;
    }
  }

  private injectPlaceholderCards(): void {
    const netProfitOrLoss = this.netProfitOrLoss;
    const placeHolders = [
      {
        title: "Total Bad Debts",
        value: "TBD",
        icon: <FaBan />,
        color: "#DC3545",
      },

      {
        title: "Income Lost to Bad Debts",
        value: "TBD",
        icon: <FaPercentage />,
        color: "#6C757D",
      },
      {
        title: "Net Profit/Loss",
        value: netProfitOrLoss
          ? Formatting.toMoney({
              amount: netProfitOrLoss,
            })
          : "TBD",
        icon: <IconProfitOrLoss />,
        color: "#6F42C1",
      },
    ];
    placeHolders.map((card, index) => {
      this.repository.allTimeCards.push({
        ...card,
        rank: index + 2,
        formattedValue: card.value,
      } as unknown as IDashboardCardData);
    });
  }

  private async fetchMonthInvoicesByType(args: {
    invoiceType: InvoiceTypeNames;
    rank: number;
  }): Promise<void> {
    const result = await new InvoiceApiService().getByInvoiceTypeAndPeriodAsync(
      {
        startDate: ReportingHelper.firstDayOfThisMonth,
        endDate: new Date(),
        invoiceType: args.invoiceType,
      }
    );
    const amount = result
      .map((invoice) => invoice.grossTotal)
      .reduce((total, amount) => total + amount, 0);
    let card = {
      formattedValue: Formatting.toMoney({
        amount: amount,
        decimalPlaces: 2,
      }),
      rawValue: amount,
      rank: args.rank,
    } as IDashboardCardData;
    if (args.invoiceType === "Supplier") {
      card = {
        ...card,
        color: "#FFC107",
        icon: <IconExpense />,
        title: this.expensesIncurredTitle,
      };
    } else {
      card = {
        ...card,
        color: "#1E90FF",
        icon: <IconInvoice />,
        title: this.amountBilledToCustomerTitle,
        onClick: () => {
          window.location.href = `/company/invoices/list/Customer?startDate=${ReportingHelper.firstDayOfThisMonth.toISOString()}&endDate=${new Date().toISOString()}`;
        },
      };
    }
    this.repository.thisMonthCards.push(card);
  }

  private async fetchAllTimeAmountOwed(args: {
    rank: number;
    invoiceType: InvoiceTypeNames;
  }) {
    const results =
      await new UnpaidInvoiceApiService().getByInvoiceTypeAndPeriodAsync({
        endDate: new Date(),
        invoiceType: args.invoiceType,
        startDate: ReportingHelper.appStartDate,
      });
    const amount = results
      .map((unpaidInvoice) => unpaidInvoice.remainingAmount)
      .reduce((total, amount) => total + amount, 0);
    this.repository.allTimeCards.push({
      onClick: () => {
        window.location.href = `/company/invoices/list/${
          args.invoiceType
        }?startDate=${ReportingHelper.appStartDate.toISOString()}&endDate=${new Date().toISOString()}`;
      },
      formattedValue: Formatting.toMoney({
        amount: amount,
        decimalPlaces: 2,
      }),
      rawValue: amount,
      color: args.invoiceType === "Supplier" ? "#D63384" : "#FF6B6B",
      icon: args.invoiceType === "Supplier" ? <IconExpense /> : <IconInvoice />,
      title:
        args.invoiceType === "Supplier"
          ? this.expensesWeOweTitle
          : "Income Owed To Us",
      rank: args.rank,
    });
  }

  private async fetchAllTimeCustomerPaymentsAsync() {
    const amount =
      await new PaymentApiService().getSumByInvoiceTypeAndPeriodAsync({
        invoiceType: "Customer",
        startDate: ReportingHelper.firstDayOfThisMonth,
        endDate: new Date(),
      });

    this.repository.allTimeCards.push({
      formattedValue: Formatting.toMoney({
        amount: amount,
        decimalPlaces: 2,
      }),
      rawValue: amount,
      icon: <FaPiggyBank />,
      color: "#17A2B8",
      title: this.incomeAllTime,
      rank: 2,
    });
  }

  private async fetchThisMonthCustomerPaymentsAsync() {
    const payments =
      await new PaymentApiService().getByInvoiceTypeAndPeriodAsync({
        invoiceType: "Customer",
        startDate: ReportingHelper.firstDayOfThisMonth,
        endDate: new Date(),
      });
    const amount = payments
      .map((payment) => payment.amount)
      .reduce((total, amount) => total + amount, 0);
    this.repository.thisMonthCards.push({
      formattedValue: Formatting.toMoney({
        amount: amount,
        decimalPlaces: 2,
      }),
      rawValue: amount,
      color: "#28A745",
      icon: <IconIncome />,
      title: this.incomeSoFarTitle,
      rank: 2,
    });
  }

  private calculateProfitOrLoss() {
    const income = this.repository.thisMonthCards.find((card) => {
      return card.title === this.incomeSoFarTitle;
    });
    const expenses = this.repository.thisMonthCards.find((card) => {
      return card.title === this.expensesIncurredTitle;
    });

    let profitOrLoss = 0;
    if (income && expenses) {
      profitOrLoss = income.rawValue - expenses.rawValue;
    }
    this.repository.thisMonthCards.push({
      formattedValue: Formatting.toMoney({
        amount: profitOrLoss,
        decimalPlaces: 2,
      }),
      rawValue: profitOrLoss,
      color: "#6610F2",
      icon: <IconProfitOrLoss />,
      title: "Profit or Loss",
      rank: 4,
    });
  }
}
