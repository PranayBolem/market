'use client';
import useHostModel from "@/app/hooks/useHostModel";
import Model from "./Model";
import { useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../Navbar/Categories";
import CategoryInput from "../Inputs/CategoryInput";
import CountrySelect from "../Inputs/CountrySelect";
import { FieldValue, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import Counter from "../Inputs/Counter";
import ImageUpload from "../Inputs/ImageUpload";
import Input from "../Inputs/Input";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
    INTRODUCTION= 0,
    BASICS      = 1,
    CATEGORY    = 2,
    LOCATION    = 3,
    INFO        = 4,
    IMAGES      = 5,
    DESCRIPTION = 6,
    PRICE       = 7,
}

const HostModel = () => {
    const HostModel = useHostModel();
    const router = useRouter();
    const [step, setStep] = useState(STEPS.INTRODUCTION);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset
    } = useForm <FieldValues> ({
        defaultValues: {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: '',
        }
    });

    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false
    }), [location]);

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        })
    }

    const onBack = () => {
        setStep((value) => value - 1);
    };

    const onNext = () => {
        setStep((value) => value + 1);
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step != STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);

        axios.post('/api/listings', data)
        .then(() => {
            toast.success('Listing Created!');
            router.refresh();
            reset();
            setStep(STEPS.INTRODUCTION);
            HostModel.onClose();
        })

        .catch(() => {
            toast.error('Something went wrong :(');
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create';
        }

        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo (() => {
        if (step === STEPS.INTRODUCTION) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
                <h1 className="text-5xl">
                    It&apos;s easy to get started
                </h1>
                <div className="
                grid
                gap-3
                max-h-[50vh]
                overflow-auto">
                    <div className="grid grid-cols-[1fr_0.5fr] gap-3 items-center">
                        <div>
                        <Heading
                            title="1  Tell us about your place"
                            subtitle="  Share some basic info, like where is is and how many guests can stay."
                        />
                        </div>
                        <div className="flex items-center justify-normal ml-2">
                            <img 
                                src="/images/interior.jpg"
                                alt="image of interior"
                                className="max-w-full max-h-[120px] object-contain"
                            />
                        </div>
                    </div>
                    <hr></hr>
                    <div className="grid grid-cols-[1fr_0.5fr] gap-3 items-center">
                        <div>
                        <Heading
                            title="2  Make it stand out"
                            subtitle="Add 5 or more photos plus a title and description we'll help you out."
                        />
                        </div>
                        <div className="flex items-center justify-normal ml-2">
                            <img 
                                src="/images/bench.jpg"
                                alt="image of interior"
                                className="max-w-full max-h-[120px] object-contain"
                            />
                        </div>
                    </div>
                    <hr></hr>
                    <div className="grid grid-cols-[1fr_0.5fr] gap-3 items-center">
                        <div>
                        <Heading
                            title="3  Finish up and publish"
                            subtitle="Choose a starting price, verify a few details, then publish your listing."
                        />
                        </div>
                        <div className="flex items-center justify-normal ml-2">
                            <img 
                                src="/images/door.jpg"
                                alt="image of interior"
                                className="max-w-full max-h-[120px] object-contain"
                            />
                        </div>
                    </div>
                </div>
        </div>

    );

    if (step === STEPS.BASICS){
        bodyContent = (
            <div className="flex flex-col gap-3">
                <Heading
                    title=" Lets start with the basics!"
                    subtitle="We'll ask you which type of property you have and if guests will
                    book the entire place or just a room. Then let us know the location and how many guests can stay"
                />
                <div className="flex justify-center items-center max-h-[50vh]">
                    <video className="w-[85%] h-auto" src="/images/basic.mp4" autoPlay muted playsInline />
                </div>
            </div>
        )
    }

    if (step === STEPS.CATEGORY){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Which of these best describes your place?"
                    subtitle="Pick a category"
                />
                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-3
                    max-h-[40vh]
                    overflow-y-auto">
                        {categories.map((item) => (
                            <div key={item.label} className="col-span-1">
                                <CategoryInput 
                                    onClick = {(category) => setCustomValue('category', category)} // defining id of the input and then value
                                    selected = {category === item.label}
                                    label = {item.label}
                                    icon = {item.icon}
                                />
                            </div>
                        ))}
                </div>
            </div>
        )
    }

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Where is your place located?"
                    subtitle="Help guests find you"
                />
                <CountrySelect
                value={location}
                    onChange={(value) => setCustomValue('location', value)}
                />
                <Map 
                    center={location?.latlng}
                />
            </div>
        )
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Share some basics about your place"
                    subtitle="What amenities do you have"
                />
                <Counter 
                    title="Guests"
                    subtitle="How many guests do you allow?"
                    value={guestCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                <hr/>
                <Counter 
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr/>
                <Counter 
                    title="Washrooms"
                    subtitle="How many bathrooms do you have?"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />
            </div>
        )
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Add pictures of your place"
                    subtitle="Show the guests what your place looks like"
                />
                <ImageUpload
                value={imageSrc}
                onChange={(value) => setCustomValue('imageSrc', value)} />
            </div>
        )
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="Describe your place"
                    subtitle="Short and sweet works the best ;)"
                />
                <Input 
                    id="title"
                    label="title"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
                <hr/>
                <Input
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Now, set your price!"
                    subtitle="Charge for each night"
                />
                <Input
                    id="price"
                    label="Price"
                    formatPrice
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        )
    }

    return (
        <Model 
        isOpen= {HostModel.isOpen}
        onClose={HostModel.onClose}
        onSubmit={handleSubmit(onSubmit)}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.INTRODUCTION ? undefined : onBack}
        title="Become a host!"
        body={bodyContent}
        />
    );
}

export default HostModel;