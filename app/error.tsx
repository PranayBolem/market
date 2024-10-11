'use client';
import { useEffect } from "react";
import EmptyState from "./components/Navbar/EmptyState";

interface ErrorStateProps {
    error: Error
}

const ErrorState: React.FC<ErrorStateProps> = ({
    error,
}) => {
    useEffect(() => {
        console.error(error);
    }, [error])

    return (
        <EmptyState 
            title="Uh Oh :("
            subtitle="Clicked something you shouldn't have?"
        />
    )
}

export default ErrorState;