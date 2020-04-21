#!/usr/bin/env node

const inquirer = require("inquirer");
const argv = require("yargs").argv;
const stepInit = require("./src/stepInit");
const stepContao = require("./src/stepContao");
const stepNode = require("./src/stepNode");
const printLn = require("./src/printLn");

const contaoQuestions = [
    {
        type: "input",
        name: "contaoVersion",
        message: "What version of Contao shall we use?",
        default: "4.9",
    },
    {
        type: "checkbox",
        message: "Setup",
        name: "localDev",
        choices: [
            {
                value: "contaoDevServer",
                name: "Install local development server",
                checked: true,
            },
            {
                value: "contaoManager",
                name: "Install Contao Manager",
                checked: true,
            },
            {
                value: "prependLocale",
                name: "Enable prepend_locale in config",
                checked: true,
            },
        ],
    },
    {
        type: "confirm",
        message: "Install DPLOY for deployment?",
        name: "dploy",
        default: false,
    },
    {
        type: "checkbox",
        message: "Which Contao Core Bundles should be installed?",
        name: "contaoCoreBundles",
        choices: [
            { name: "News", checked: true, value: "contao/news-bundle" },
            {
                name: "Calendar",
                checked: false,
                value: "contao/calendar-bundle",
            },
            {
                name: "Comments",
                checked: false,
                value: "contao/comments-bundle",
            },
            { name: "FAQ", checked: false, value: "contao/faq-bundle" },
            {
                name: "Newsletter",
                checked: false,
                value: "contao/newsletter-bundle",
            },
        ],
    },
    {
        type: "checkbox",
        message: "Which Contao Plugin Bundles should be installed?",
        name: "contaoPluginBundles",
        choices: [
            {
                name: "Content API (Die Schittigs)",
                checked: false,
                value: "dieschittigs/contao-content-api",
            },
            {
                name: "Leads (terminal42)",
                checked: false,
                value: "terminal42/contao-leads",
            },
            {
                name: "ChangeLanguage (terminal42)",
                checked: false,
                value: "terminal42/contao-changelanguage",
            },
            {
                name: "MultiColumWizard (MEN AT WORK)",
                checked: false,
                value: "menatwork/contao-multicolumnwizard",
            },
            {
                name: "Notification Center (terminal42)",
                checked: false,
                value: "terminal42/notification_center",
            },
        ],
    },
    {
        type: "confirm",
        message: "Install Webpack and boilerplate code?",
        name: "webpack",
        default: true,
    },
];

const jsQuestions = [
    {
        type: "checkbox",
        message: "Additional JS libraries",
        name: "jsPackages",
        choices: [
            { value: "jquery", title: "jQuery - Still kickin'", checked: true },
            {
                value: "slick-carousel",
                title: "Slick - The last carousel you'll ever need",
                checked: true,
            },
            {
                value: "stickyfilljs",
                title: "StickFillJS - CSS position: sticky Polyfill",
                checked: true,
            },
            {
                value: "smooth-scroll",
                title: "Smooth Scroll - Animate scrolling to anchor links",
                checked: true,
            },
            {
                value: "magnific-popup",
                title:
                    "Magnific Popup - Fast, light and responsive lightbox plugin for jQuery",
                checked: true,
            },
            {
                value: "lodash",
                title: "Lodash - A JavaScript utility library",
                checked: false,
            },
            {
                value: "moment",
                title:
                    "Moment.js - Parse, validate, manipulate, and display dates and times",
                checked: false,
            },
            {
                value: "axios",
                title: "Axios - Promise based HTTP client",
                checked: false,
            },
            {
                value: "font-awesome",
                title: "Font Awesome - The iconic font and CSS framework",
                checked: false,
            },
            {
                value: "react react-dom",
                title: "React - A library for building UIs",
                checked: false,
            },
            {
                value: "vue",
                title: "Vue.js - The Progressive JavaScript Framework",
                checked: false,
            },
        ],
    },
];

async function main() {
    printLn.nfo("👋 Hi, welcome to Create Contao App!");
    let dir = "./";
    if (argv._ && argv._.length) dir = argv._[0];
    if (!(await stepInit(dir))) return;
    let answers = await inquirer.prompt(contaoQuestions);
    if (answers.webpack) {
        answers = { ...answers, ...(await inquirer.prompt(jsQuestions)) };
    }
    printLn.nfo("🚩 Setting up your Contao Installation");
    await stepContao(answers);
    printLn.nfo("🚩 Adding JavaScript packages");
    await stepNode(answers);

    printLn.nfo("🚩 All done 🥳");
}

main();
