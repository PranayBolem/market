'use client';
import { AiOutlineMenu } from 'react-icons/ai';
import Avatar from '../Avatar';
import MenuItem from './MenuItem';
import { useCallback, useState, useEffect, useRef } from 'react';
import useRegisterModel from '@/app/hooks/useRegisterModel';
import useLoginModel from '@/app/hooks/useLoginModel';
import useHostModel from '@/app/hooks/useHostModel';
import { signOut } from 'next-auth/react';
import { SafeUser } from '@/app/types';

interface UserMenuProps {
    currentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
}) => {
    const RegisterModel = useRegisterModel(); // used for showing the sign up form on the screen when the user interacts with the navbar
    const LoginModel = useLoginModel(); // used to show the login form on the screen
    const HostModel = useHostModel();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null); // used to track the clicks when interacting with user menu
    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsOpen(false); // close the menu if clicked outside
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); 
        };
    }, [isOpen, handleClickOutside]);
    
    const onRent = useCallback(() => {
        if(!currentUser) {
            return LoginModel.onOpen();
        }
        HostModel.onOpen();
    }, [currentUser, LoginModel, HostModel]);

    return (
        <div className="relative" ref={menuRef}>
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={onRent}
                    className="
                        hidden
                        md:block
                        text-sm
                        font-semibold
                        py-3
                        px-4
                        rounded-full
                        hover:bg-neutral-100
                        transition
                        cursor-pointer">
                    Be a host !
                </div>
                <div
                    onClick={toggleOpen}
                    className="
                        p-4
                        md.py-1
                        md.px-2
                        border-[1px]
                        border-neutral-200
                        flex
                        flex-row
                        items-center
                        gap-3
                        rounded-full
                        cursor-pointer
                        hover:shadow-md
                        transition">
                    <AiOutlineMenu/>
                    <div className="hidden md:block">
                        <Avatar src={currentUser ?. image} />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className="
                        absolute
                        rounded-xl
                        shadow-md
                        w-[40vw]
                        md:w-3/4
                        bg-white
                        overflow-hidden
                        right-0
                        top-16
                        text-sm">
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (
                            <>
                                <MenuItem
                                    onClick={() => {}}
                                    lable="My trips"/>
                                <MenuItem
                                    onClick={() => {}}
                                    lable="My favourites"/>
                                <MenuItem
                                    onClick={() => {}}
                                    lable="My reservations"/>
                                <MenuItem
                                    onClick={() => {}}
                                    lable="My properties"/>
                                <MenuItem
                                    onClick={HostModel.onOpen}
                                    lable="Become a host"/>
                                <hr />
                                <MenuItem
                                    onClick={() => signOut()}
                                    lable="Logout"/>
                            </>
                        ) : (
                            <>
                                <MenuItem
                                    onClick={LoginModel.onOpen}
                                    lable="Login"/>
                                <MenuItem
                                    onClick={RegisterModel.onOpen}
                                    lable="Sign up"/>
                            </>
                        )}
                    </div>
                </div>
            
            )}

        </div>
    );
}

export default UserMenu;