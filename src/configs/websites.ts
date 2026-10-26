import type { WebsitesData } from "~/types";

const websites: WebsitesData = {
  favorites: {
    title: "Mes Liens",
    sites: [
      {
        id: "my-email",
        title: "Email",
        img: "img/sites/gmail.svg",
        link: "mailto:antoine.brnl@proton.me",
      },
      {
        id: "my-github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/antoinebrnl",
      },
      {
        id: "my-linkedin",
        title: "Linkedin",
        img: "img/sites/linkedin.svg",
        link: "https://www.linkedin.com/in/antoine-brnl-7a7791385",
      },
      {
        id: "my-instagram",
        title: "Instagram",
        img: "img/sites/twitter.svg",
        link: "https://www.instagram.com/data_horizon1",
      },
      {
        id: "my-portfolio",
        title: "Portfolio",
        img: "img/sites/hacker.svg",
        link: "https://antoine-brnl.com",
      },
    ],
  },
  freq: {
    title: "Frequently Visited",
    sites: [
      {
        id: "github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/",
      },
      {
        id: "figma",
        title: "Figma",
        img: "img/sites/github.svg",
        link: "https://www.figma.com/",
      },
      {
        id: "dribbble",
        title: "Dribbble",
        img: "img/sites/hacker.svg",
        link: "https://dribbble.com/",
      },
      {
        id: "producthunt",
        title: "Product Hunt",
        img: "img/sites/hacker.svg",
        link: "https://www.producthunt.com/",
      },
      {
        id: "vercel",
        title: "Vercel",
        img: "img/sites/github.svg",
        link: "https://vercel.com/",
      },
    ],
  },
};

export default websites;
