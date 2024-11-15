import React, { useState, useEffect } from 'react';
import { Link } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { useScrollPosition } from '../Hooks/scrollPosition';

const NavBar = () => {
    const [navBarOpen, setNavBarOpen] = useState(false);
    const [windowDimension, setWindowDimension] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    
    const location = useLocation();

    const detectDimension = () => {
        setWindowDimension({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    useEffect(() => {
        window.addEventListener("resize", detectDimension);
        windowDimension.width > 800 && setNavBarOpen(false);
        return () => {
            window.removeEventListener("resize", detectDimension);
        };
    }, [windowDimension]);

    const links = [
        {
            id: 1,
            link: "Home",
        },
        {
            id: 2,
            link: "Perfil",
        },
    ];

    const scrollPosition = useScrollPosition();

    const renderLink = (x) => {
        if (x.link === "Perfil") {
            return (
                <RouterLink
                    onClick={() => setNavBarOpen(false)}
                    to="/perfil"
                    className={styles.navLink}
                >
                    {x.link}
                </RouterLink>
            );
        } else if (x.link === "Home") {
            return (
                <RouterLink
                    onClick={() => setNavBarOpen(false)}
                    to="/"
                    className={styles.navLink}
                >
                    {x.link}
                </RouterLink>
            );
        } else {
            return (
                <Link
                    onClick={() => setNavBarOpen(false)}
                    to={x.link}
                    smooth
                    duration={500}
                    className={styles.navLink}
                >
                    {x.link === "HowWeWork" ? "How we work" : x.link}
                </Link>
            );
        }
    };

    if(location.pathname.includes("publicaciones")) return null;

    return (
        <div className={
            navBarOpen
                ? styles.navOpen
                : scrollPosition > 0
                    ? styles.navOnScroll
                    : styles.navBar
        }>
            {!navBarOpen && <p className={styles.logo}> DocTIC | Online | Usuario</p>}
            {!navBarOpen && windowDimension.width < 800 ? (
                <TiThMenu
                    color="#f1f1f1"
                    onClick={() => setNavBarOpen(!navBarOpen)}
                    size={25}
                />
            ) : (
                windowDimension.width < 800 && (
                    <IoClose onClick={() => setNavBarOpen(!navBarOpen)}
                        color="#f1f1f1"
                        size={25}
                    />
                )
            )}
            {navBarOpen && (
                <ul className={styles.linksContainer}>
                    {links.map((x) => (
                        <div key={x.id}>
                            {renderLink(x)}
                        </div>
                    ))}
                </ul>
            )}
            {windowDimension.width > 800 && (
                <ul className={styles.linksContainer}>
                    {links.map((x) => (
                        <div key={x.id}>
                            {renderLink(x)}
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NavBar;