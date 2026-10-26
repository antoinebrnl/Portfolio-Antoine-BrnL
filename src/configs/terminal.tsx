import type { TerminalData } from "~/types";

const terminal: TerminalData[] = [
  {
    id: "about",
    title: "about",
    type: "folder",
    children: [
      {
        id: "about-me",
        title: "intro.txt",
        type: "file",
        content: (
          <div className="py-1">
            <div>
              Je pense, j'invente, je code... Bref, j'entreprends.
            </div>
            <div className="mt-2">
              Je suis Antoine BrnL — développeur, designer et entrepreneur.
              Je crée des expériences digitales qui repoussent les limites du possible.
            </div>
          </div>
        )
      },
      {
        id: "about-interests",
        title: "interests.txt",
        type: "file",
        content: "Développement créatif / Design UI-UX / 3D & Motion / Entrepreneuriat / Innovation"
      },
      {
        id: "about-vision",
        title: "vision.txt",
        type: "file",
        content:
          "Je pense à des choses révolutionnaires. Mon objectif : transformer des idées en produits qui changent la donne."
      },
      {
        id: "about-contact",
        title: "contact.txt",
        type: "file",
        content: (
          <ul className="list-disc ml-6">
            <li>
              Email:{" "}
              <a
                className="text-blue-300"
                href="mailto:antoine.brnl@proton.me"
                target="_blank"
                rel="noreferrer"
              >
                antoine.brnl@proton.me
              </a>
            </li>
            <li>
              Github:{" "}
              <a
                className="text-blue-300"
                href="https://github.com/antoinebrnl"
                target="_blank"
                rel="noreferrer"
              >
                @antoinebrnl
              </a>
            </li>
            <li>
              Linkedin:{" "}
              <a
                className="text-blue-300"
                href="https://www.linkedin.com/in/antoine-brnl-7a7791385"
                target="_blank"
                rel="noreferrer"
              >
                Antoine BrnL
              </a>
            </li>
            <li>
              Instagram:{" "}
              <a
                className="text-blue-300"
                href="https://www.instagram.com/data_horizon1"
                target="_blank"
                rel="noreferrer"
              >
                @data_horizon1
              </a>
            </li>
            <li>
              Portfolio:{" "}
              <a
                className="text-blue-300"
                href="https://antoine-brnl.com"
                target="_blank"
                rel="noreferrer"
              >
                antoine-brnl.com
              </a>
            </li>
          </ul>
        )
      }
    ]
  },
  {
    id: "about-dream",
    title: "my-vision.js",
    type: "file",
    content: (
      <div className="py-1">
        <div>
          <span className="text-purple-400">const</span>{" "}
          <span className="text-blue-400">antoine</span> = {"{"} 
        </div>
        <div className="ml-6">
          <span className="text-green-400">mindset</span>:{" "}
          <span className="text-yellow-400">"think different"</span>,
        </div>
        <div className="ml-6">
          <span className="text-green-400">passion</span>:{" "}
          <span className="text-yellow-400">"turning ideas into reality"</span>,
        </div>
        <div className="ml-6">
          <span className="text-green-400">motto</span>:{" "}
          <span className="text-yellow-400">"je pense, j'invente, je code"</span>,
        </div>
        <div>{"}"}</div>
        <div className="mt-2">
          <span className="text-purple-400">while</span>(
          <span className="text-blue-400">true</span>) {"{"}
        </div>
        <div className="ml-6">
          <span className="text-blue-400">antoine</span>.
          <span className="text-yellow-400">build</span>();
        </div>
        <div className="ml-6">
          <span className="text-blue-400">antoine</span>.
          <span className="text-yellow-400">innovate</span>();
        </div>
        <div className="ml-6">
          <span className="text-blue-400">antoine</span>.
          <span className="text-yellow-400">disrupt</span>();
        </div>
        <div>{"}"}</div>
      </div>
    )
  }
];

export default terminal;
