import React from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
//login

export const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

export const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
        </button>
    );
};

export const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    if (isLoading) {
    return <div>Loading ...</div>;
    }
    return (
    isAuthenticated && (
        <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        </div>
    )
    );
};

//fin login

// export {LoginButton,LogoutButton,Profile}