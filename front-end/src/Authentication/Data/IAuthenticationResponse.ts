import RoleNames from "@/Roles/Data/RoleNames";

// IAuthenticationResponse.ts
export default interface IAuthenticationResponse {
  id: string; // UUID of the authentication response
  deleted: boolean; // Indicates if the user or entity is deleted
  modified: string; // Last modified timestamp as an ISO string
  email: string; // Email address of the user
  userRoleIds: string[]; // Array of roles (strings)
  companyDisplayLabel: string; // Display name of the company
  companyType: string; // Type or category of the company
  userId: string; // UUID of the user
  companyId: string; // UUID of the company
  userRoleNames: RoleNames[];
}
