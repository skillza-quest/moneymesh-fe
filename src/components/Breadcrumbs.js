import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    return (
        <div>
            <Link to="/">Home</Link>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                return isLast ? (
                    <span key={name}> / {name}</span>
                ) : (
                    <Link key={name} to={routeTo}> / {name}</Link>
                );
            })}
        </div>
    );
};

export default Breadcrumbs;
