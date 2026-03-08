import { SearchApplication } from "../types/application";


export function groupTechgenCollege(techgens: SearchApplication["techgens"], colleges: SearchApplication["colleges"], college_names: SearchApplication["college_names"]) {
    const grouped: Record<string, string>[] = [];

    techgens.forEach((techgen, index) => {
        const college = colleges[index];
        let collegeName = college_names[index];
        if(!college && !collegeName){
            collegeName = "Unknown College";
        }else if(college && college !== "Other"){
            collegeName = college;
        }
        const currGroup = {
            full_name: techgen,
            college: collegeName,
        }
        grouped.push(currGroup);
    });

    return grouped;
}