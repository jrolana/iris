import { getApplicationsByQuery } from '../../services/application/get-applications-with-query';

// get the type of the whole array returned by the function
export type ApplicationsList = Awaited<ReturnType<typeof getApplicationsByQuery>>;

// get the type of a single application from the array
export type Application = NonNullable<ApplicationsList>[number];

export function sortApplications(applications: ApplicationsList, sortByKey: keyof Application, ascending: boolean = true): ApplicationsList {
    if (!applications) return [];
    if (!sortByKey) return applications;
    const sortedApplications = [...applications];

    sortedApplications.sort((a, b) => {
        const aValue = a[sortByKey];
        const bValue = b[sortByKey];

        const aIsFalsy = aValue === null || aValue === undefined;
        const bIsFalsy = bValue === null || bValue === undefined;

        // If both are null/undefined, leave them in their current order
        if (aIsFalsy && bIsFalsy) return 0;
        
        // Always push null/undefined to the bottom
        if (aIsFalsy) return 1;
        if (bIsFalsy) return -1;

        // Compare actual values based on the sort direction
        if (aValue < bValue) return ascending ? -1 : 1;
        if (aValue > bValue) return ascending ? 1 : -1;
        
        return 0;
    });

    return sortedApplications;
}