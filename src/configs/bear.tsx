import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile",
    title: "Profile",
    icon: "i-ph:paw-print",
    md: [
      {
        id: "about-me",
        title: "About Me",
        file: "markdown/about-me.md",
        icon: "i-ph:shield-star",
        excerpt: "Je pense, j'invente, je code... Bref, j'entreprends."
      },
      {
        id: "github-stats",
        title: "Github Stats",
        file: "markdown/github-stats.md",
        icon: "i-fa6-brands:github",
        excerpt: "Mes statistiques GitHub et langages les plus utilisés..."
      },
      {
        id: "about-site",
        title: "About This Site",
        file: "markdown/about-site.md",
        icon: "i-ph:browser",
        excerpt: "À propos de ce portfolio interactif macOS..."
      }
    ]
  },
  {
    id: "project",
    title: "Projects",
    icon: "i-ph:git-branch",
    md: [
      {
        id: "project-1",
        title: "Projet Horizon",
        file: "markdown/about-me.md",
        icon: "i-ph:rocket-launch",
        excerpt: "Plateforme SaaS innovante — Coming soon...",
        link: "https://github.com/antoinebrnl"
      },
      {
        id: "project-2",
        title: "Portfolio macOS",
        file: "markdown/about-site.md",
        icon: "i-ph:desktop",
        excerpt: "Portfolio interactif simulant macOS Tahoe 26...",
        link: "https://antoine-brnl.com"
      },
      {
        id: "project-3",
        title: "Projet Nexus",
        file: "markdown/about-me.md",
        icon: "i-ph:lightning",
        excerpt: "Application mobile révolutionnaire — Coming soon...",
        link: "https://github.com/antoinebrnl"
      }
    ]
  }
];

export default bear;
