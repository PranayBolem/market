'use client';
import Model from './Model';
import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useRegisterModel from '@/app/hooks/useRegisterModel';
import Heading from '../Heading';
import Input from '../Inputs/Input';
import toast, { Toast } from 'react-hot-toast';
import Button from '../Button';

const RegisterModel = () => {
    const RegisterModel = useRegisterModel ();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, }
    } = useForm <FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/register', data)
            .then(() => {
                RegisterModel.onClose();
            })
            .catch((error) => {
                toast.error('Something went wrong!');
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading 
                title='Welcome to HomeStays'
                subtitle='Create an account!'
                center
            />
            <Input 
                id="email"
                label='Email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id="name"
                label='Name'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id="password"
                type='password'
                label='Password'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button 
                outline
                label='Continue with Google'
                Icon={FcGoogle}
                onClick={() => {}}
            />
            <Button 
                outline
                label='Continue with Github'
                Icon={AiFillGithub}
                onClick={() => {}}
            />
            <div
                className='
                text-neutral-500
                text-center
                mt-4
                font-light'
            >
                <div className='justify-center flex flex-row items-centre gap-2'>
                    <div>
                        Already have an account with us?
                    </div>
                    <div
                        onClick={RegisterModel.onClose} // closing the box if the user presses login button
                        className='
                            text-neutral-800
                            cursor-pointer
                            hover:underline'
                    >
                        Log in
                    </div>
                </div>
            </div>
        </div>
    )

    return(
        <Model
            disabled={isLoading} //we dont want the user to change anything in this form so it is disabled
            isOpen={RegisterModel.isOpen}
            title='Register'
            actionLabel='continue'
            onClose={RegisterModel.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default RegisterModel;