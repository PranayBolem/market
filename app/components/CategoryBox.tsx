'use client';
import { IconType } from "react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import queryString from "query-string";

interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    icon: Icon,
    label,
    selected
}) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {};

        if (params) {
            currentQuery = queryString.parse(params.toString());
        }

        // if we click on one of the categories its label will be assigned to category in the url so that the user will be redirected to that category page
        const updatedQuery: any = {
            ...currentQuery,
            category: label
        }

        // if the user selectes the same category again then we return back to the home (de-selecting)
        if (params?.get('category') === label) {
            delete updatedQuery.category;
        }

        const url = queryString.stringifyUrl ({
            url: '/',
            query: updatedQuery},
            { skipNull: true}
        );

        router.push(url);

    }, [label, params, router]);


    return (
        // categories below the search bar
        <div
        onClick={handleClick} 
        className={`
            flex
            flex-col
            items-center
            justify-center
            gap-2
            p-2
            border-b-2
            hover:text-neutral-800
            transition
            cursor-pointer
            ${selected ? 'border-b-neutral-800' : 'border-transparent'}
            ${selected ? 'text-neutral-800' : 'text-neutral-500'}`}>
                <Icon size={23} />
                <div className="font-medium text-sm">
                    {label}
                </div>
        </div>
    )
}

export default CategoryBox;