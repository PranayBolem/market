'use client';
import { useCallback, useMemo, useState } from "react";
import useSearchModel from "@/app/hooks/useSearchModel";
import Model from "./Model"
import { useRouter, useSearchParams } from "next/navigation";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../Inputs/CountrySelect";
import qs from "query-string";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calendar from "../Inputs/Calendar";
import Counter from "../Inputs/Counter";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2
}

const SearchModel = () => {
    const router = useRouter();
    const params = useSearchParams();
    const searchModel = useSearchModel();

    const [location, setLocation] = useState<CountrySelectValue>();
    const [step, setStep] = useState(STEPS.LOCATION);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false,
    }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback (() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(async () => {
        if (step != STEPS.INFO) {
            return onNext();
        }

        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount
        };

        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }

        if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = qs.stringifyUrl({
            url: '/',
            query: updatedQuery
        }, {skipNull: true});

        setStep(STEPS.LOCATION);
        searchModel.onClose();

        router.push(url);

    }, [step, searchModel, location, router, guestCount, roomCount, bathroomCount, dateRange, onNext, params])


    const actionLabel = useMemo(() => {
        if (step == STEPS.INFO) {
            return 'Search';
        }

        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step == STEPS.LOCATION) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
                title="Where do you wanna go?"
                subtitle="Find the perfect holiday home :) "
            />
            <CountrySelect 
                value={location}
                onChange={(value) => 
                    setLocation(value as CountrySelectValue)
                }
            />
            <hr/>
            <Map center={location?.latlng} />
        </div>
    )

    if (step == STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="When do you plan to go?"
                    subtitle="Make sure yours friends and family have free time"
                />
                <Calendar 
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        )
    }

    if (step == STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="More information"
                    subtitle="Find your perfect getway"
                />
                <Counter 
                    title="Guests"
                    subtitle="How many guests are on the trip?"
                    value={guestCount}
                    onChange={(value) => setGuestCount(value)}
                />
                <Counter 
                    title="Rooms"
                    subtitle="How many rooms would you require?"
                    value={roomCount}
                    onChange={(value) => setRoomCount(value)}
                />
                <Counter 
                    title="Bathrooms"
                    subtitle="How many bathrooms would you require?"
                    value={bathroomCount}
                    onChange={(value) => setBathroomCount(value)}
                />
            </div>
        )
    }

    return (
        <Model 
            isOpen={searchModel.isOpen}
            onClose={searchModel.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step == STEPS.LOCATION ? undefined : onBack}
            body={bodyContent}
        />
    );
}

export default SearchModel;