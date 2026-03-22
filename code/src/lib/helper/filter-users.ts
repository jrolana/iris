
import { CollegeUnitType } from "../types/college-units";
import { RoleType } from "../types/role";
import { RegistrationRequestType, UserType } from "../types/users";


interface UsersFilterCriteria {
  nameEmail?: string;
  colleges?: CollegeUnitType[];
  roles?: RoleType[];
}

export function filterUsers(users: UserType["Row"][], filters: UsersFilterCriteria): UserType["Row"][] {
  return users.filter((user) => {
    // Name/Email filter
    if (filters.nameEmail) {
      const searchTerm = filters.nameEmail.toLowerCase();
        const nameEmailMatch =
            user.full_name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm);
      if (!nameEmailMatch) return false;
    }
    // Colleges filter
    if (filters.colleges && filters.colleges.length > 0) {
      if (!filters.colleges.includes(user.college_code as CollegeUnitType)) return false;
    }
    // Roles filter
    if (filters.roles && filters.roles.length > 0) {
      if (!filters.roles.includes(user.role)) return false;
    }
    return true;
  });
}

interface UserRequestFilterCriteria {
  nameEmail?: string;
  colleges?: CollegeUnitType[];
  roles?: RoleType[];
  statuses?: ("approved" | "rejected" | "pending")[];
}

export function filterRegistrationRequests(requests: RegistrationRequestType["Row"][], filters: UserRequestFilterCriteria): RegistrationRequestType["Row"][] {
    return requests.filter((request) => {
        // Name/Email filter
        if (filters.nameEmail) {
          const searchTerm = filters.nameEmail.toLowerCase();
            const nameEmailMatch =
                request.full_name.toLowerCase().includes(searchTerm) || 
                request.email.toLowerCase().includes(searchTerm);
          if (!nameEmailMatch) return false;
        }
        // Colleges filter
        if (filters.colleges && filters.colleges.length > 0) {
          if (!filters.colleges.includes(request.college_code as CollegeUnitType)) return false;
        }
        // Roles filter
        if (filters.roles && filters.roles.length > 0) {
          if (!filters.roles.includes(request.role)) return false;
        }

        // Statuses filter
        if (filters.statuses && filters.statuses.length > 0) {
            if (!filters.statuses.includes(request.status)) return false;
        } 
        return true;
    });
}