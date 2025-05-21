import PermissionNames from "@/Permissions/Data/PermissionNames";

export default interface IIndustryNodeDescriber{
    displayLabel: string;
    permissions: PermissionNames[];
    onClick: () => void | Promise<void>;
    icon: React.ReactNode;
}
