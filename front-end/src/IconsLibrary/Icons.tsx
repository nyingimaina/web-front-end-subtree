import {
  FaBalanceScale,
  FaScroll,
  FaShippingFast,
  FaShoppingCart,
} from "react-icons/fa";
import { FaWallet } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { PiBuildingApartment } from "react-icons/pi";
import { RiUserStarFill } from "react-icons/ri";
import { VscOutput, VscFile } from "react-icons/vsc";

function IconInvoice(args?: { className?: string }) {
  return <LiaFileInvoiceDollarSolid className={args?.className} />;
}

function IconExpense(args?: { className?: string }) {
  return <FaShoppingCart className={args?.className} />;
}

function IconAdd(args?: { className?: string }) {
  return <IoIosAddCircleOutline className={args?.className} />;
}

function IconSettings(args?: { className?: string }) {
  return <FiSettings className={args?.className} />;
}

function IconLog(args?: { className?: string }) {
  return <VscOutput className={args?.className} />;
}

function IconFile(args?: { className?: string }) {
  return <VscFile className={args?.className} />;
}

function IconIncome(args?: { className?: string }) {
  return <FaWallet className={args?.className} />;
}

function IconProfitOrLoss(args?: { className?: string }) {
  return <FaBalanceScale className={args?.className} />;
}

function IconAccountStatements(args?: { className?: string }) {
  return <FaScroll className={args?.className} />;
}

function IconSupplier(args?: { className?: string }) {
  return <FaShippingFast className={args?.className} />;
}

function IconCustomer(args?: { className?: string }) {
  return <RiUserStarFill className={args?.className} />;
}

function IconBuilding(args?: { className?: string }) {
  return <PiBuildingApartment className={args?.className} />;
}

export {
  IconBuilding,
  IconProfitOrLoss,
  IconInvoice,
  IconExpense,
  IconAdd,
  IconSettings,
  IconLog,
  IconFile,
  IconIncome,
  IconAccountStatements,
  IconSupplier,
  IconCustomer,
};
