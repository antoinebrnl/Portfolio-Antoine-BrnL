import { localize } from "~/i18n";
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
              {localize("Je pense, j'invente, je code... Bref, j'entreprends.")}</div>
            <div className="mt-2">
              {localize("Je suis Antoine BrnL — développeur, designer et entrepreneur. Je crée des expériences digitales qui repoussent les limites du possible.")}</div>
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
              {localize("Email:")}{localize(" ")}
              <a
                className="text-blue-300"
                href="mailto:antoine.brnl@proton.me"
                target="_blank"
                rel="noreferrer"
              >
                {localize("antoine.brnl@proton.me")}</a>
            </li>
            <li>
              {localize("Github:")}{localize(" ")}
              <a
                className="text-blue-300"
                href="https://github.com/antoinebrnl"
                target="_blank"
                rel="noreferrer"
              >
                {localize("@antoinebrnl")}</a>
            </li>
            <li>
              {localize("Linkedin:")}{localize(" ")}
              <a
                className="text-blue-300"
                href="https://www.linkedin.com/in/antoine-brnl-7a7791385"
                target="_blank"
                rel="noreferrer"
              >
                {localize("Antoine BrnL")}</a>
            </li>
            <li>
              {localize("Instagram:")}{localize(" ")}
              <a
                className="text-blue-300"
                href="https://www.instagram.com/data_horizon1"
                target="_blank"
                rel="noreferrer"
              >
                {localize("@data_horizon1")}</a>
            </li>
            <li>
              {localize("Portfolio:")}{localize(" ")}
              <a
                className="text-blue-300"
                href="https://antoine-brnl.com"
                target="_blank"
                rel="noreferrer"
              >
                {localize("antoine-brnl.com")}</a>
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
          <span className="text-purple-400">{localize("const")}</span>{localize(" ")}
          <span className="text-blue-400">{localize("antoine")}</span> {localize(" = ")}{localize("{")}
        </div>
        <div className="ml-6">
          <span className="text-green-400">{localize("mindset")}</span>{localize(":")}{localize(" ")}
          <span className="text-yellow-400">{localize("\"think different\"")}</span>{localize(",")}</div>
        <div className="ml-6">
          <span className="text-green-400">{localize("passion")}</span>{localize(":")}{localize(" ")}
          <span className="text-yellow-400">{localize("\"turning ideas into reality\"")}</span>{localize(",")}</div>
        <div className="ml-6">
          <span className="text-green-400">{localize("motto")}</span>{localize(":")}{localize(" ")}
          <span className="text-yellow-400">{localize("\"je pense, j'invente, je code\"")}</span>{localize(",")}</div>
        <div>{localize("}")}</div>
        <div className="mt-2">
          <span className="text-purple-400">{localize("while")}</span>{localize("(")}<span className="text-blue-400">{localize("true")}</span>{localize(") ")}{localize("{")}
        </div>
        <div className="ml-6">
          <span className="text-blue-400">{localize("antoine")}</span>{localize(".")}<span className="text-yellow-400">{localize("build")}</span>{localize("();")}</div>
        <div className="ml-6">
          <span className="text-blue-400">{localize("antoine")}</span>{localize(".")}<span className="text-yellow-400">{localize("innovate")}</span>{localize("();")}</div>
        <div className="ml-6">
          <span className="text-blue-400">{localize("antoine")}</span>{localize(".")}<span className="text-yellow-400">{localize("disrupt")}</span>{localize("();")}</div>
        <div>{localize("}")}</div>
      </div>
    )
  }
];

export default terminal;
