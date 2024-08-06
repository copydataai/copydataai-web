import type { Site } from "./types";

export const SITE: Site = {
	website: "https://copydataai.com/",
	author: "Jose Sanchez",
	desc: "A Collection of Blogs related to my Journey",
	title: "Thriving greatness",
	ogImage: "",
	lightAndDarkMode: true,
	postPerPage: 5,
};

export const LOCALE = {
	lang: "en", // html lang code. Set this empty and default will be "en"
	langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
	enable: false,
	svg: true,
	width: 80,
	height: 30,
};

export const SOCIALS = {
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
};
