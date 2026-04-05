import { SearchApplication } from '../types/application';



export function sortApplications(applications: SearchApplication[], sortByKey: keyof SearchApplication = "updated_at", ascending: boolean = true): SearchApplication[] {
    if (!applications) return [];
    const sortedApplications = [...applications];

    sortedApplications.sort((a, b) => {
        // first, sort by archived status (archived items go to the bottom)
        const aIsArchived = a.is_archived === true;
        const bIsArchived = b.is_archived === true;
        

        if (aIsArchived && !bIsArchived) return 1;  // Push 'a' down
        if (!aIsArchived && bIsArchived) return -1; // Push 'b' down

        // proceed with sorting by the specified key, handling null/undefined values
        const aValue = a[sortByKey];
        const bValue = b[sortByKey];
        

        const aIsFalsy = aValue === null || aValue === undefined;
        const bIsFalsy = bValue === null || bValue === undefined;

        // if both are null/undefined, leave them in their current order
        if (aIsFalsy && bIsFalsy) return 0;
        
        // always push null/undefined to the bottom of their respective groups
        if (aIsFalsy) return 1;
        if (bIsFalsy) return -1;

        // compare actual values based on the sort direction
        if(typeof aValue === 'string' && typeof bValue === 'string') {
            if (aValue.toLowerCase() < bValue.toLowerCase()) return ascending ? -1 : 1;
            if (aValue.toLowerCase() > bValue.toLowerCase()) return ascending ? 1 : -1;
            return 0;
        }
        if (aValue < bValue) return ascending ? -1 : 1;
        if (aValue > bValue) return ascending ? 1 : -1;
        
        return 0;
    });

    return sortedApplications;
}