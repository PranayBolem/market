'use client';
import Model from './Model';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import useRegisterModel from '@/app/hooks/useRegisterModel';
import useLoginModel from '@/app/hooks/useLoginModel';
import Heading from '../Heading';
import Input from '../Inputs/Input';
import toast, { Toast } from 'react-hot-toast';
import Button from '../Button';
import { useRouter } from 'next/navigation';

const LoginModel = () => {
    const router = useRouter ();
    const RegisterModel = useRegisterModel ();
    const LoginModel = useLoginModel ();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, }
    } = useForm <FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn ('credentials', {
            ...data,
            redirect: false,
        })
        .then((callback) => {
            setIsLoading(false);

            if (callback?.ok) {
                toast.success('Logged In');
                router.refresh();
                LoginModel.onClose();
            }

            if (callback?.error) {
                toast.error(callback.error);
            }
        })
    }

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading 
                title='Welcome Back'
                subtitle='Login to your account!'
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
            isOpen={LoginModel.isOpen}
            title='Login'
            actionLabel='continue'
            onClose={LoginModel.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}

export default LoginModel;