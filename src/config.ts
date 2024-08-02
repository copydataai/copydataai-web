import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
    website: "https://copydataai.com/",
    author: "Jose Sanchez",
    desc: "A Collection of Blogs related to my Journey",
    title: "Thriving greatness",
    ogImage: "",
    lightAndDarkMode: true,
    postPerPage: 5,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
    enable: false,
    svg: true,
    width: 80,
    height: 30,
};

export const SOCIALS: SocialObjects = {
    Github: {
        name: "Github",
        href: "https://github.com/copydataai",
        linkTitle: `${SITE.author} on Github`,
        active: true,
    },
    Linkedin: {
        name: "Linkedin",
        href: "https://www.linkedin.com/in/copydataai",
        linkTitle: `${SITE.author} on LinkedIn`,
        active: true,
    },
    Mail: {
        name: "Mail",
        href: "mailto:me@copydataai.com",
        linkTitle: `Send an email to ${SITE.author}`,
        active: true,
    },
    Twitter: {

        name: "Twitter",
        href: "https://x.com/copydataaireal",
        linkTitle: `${SITE.author} on Twitter`,
        active: true,
    },
}
