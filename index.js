#!/usr/bin/env node

const inquirer = require("inquirer");
const argv = require("yargs").argv;
const stepInit = require("./src/stepInit");
const stepContao = require("./src/stepContao");
const stepNode = require("./src/stepNode");
const stepCopy = require("./src/stepCopy");
const stepFinish = require("./src/stepFinish");
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
                value: "enableDebug",
                name: "Enable debug mode in .env",
                checked: true,
            },
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
            {
                value: "removeSuffix",
                name: "Set empty url_suffix in config",
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
                name: "Slick - The last carousel you'll ever need",
                checked: true,
            },
            {
                value: "stickyfilljs",
                name: "StickFillJS - CSS position: sticky Polyfill",
                checked: true,
            },
            {
                value: "smooth-scroll",
                name: "Smooth Scroll - Animate scrolling to anchor links",
                checked: true,
            },
            {
                value: "magnific-popup",
                name:
                    "Magnific Popup - Fast, light and responsive lightbox plugin for jQuery",
                checked: true,
            },
            {
                value: "lodash",
                name: "Lodash - A JavaScript utility library",
                checked: false,
            },
            {
                value: "moment",
                name:
                    "Moment.js - Parse, validate, manipulate, and display dates and times",
                checked: false,
            },
            {
                value: "axios",
                name: "Axios - Promise based HTTP client",
                checked: false,
            },
            {
                value: "font-awesome",
                name: "Font Awesome - The iconic font and CSS framework",
                checked: false,
            },
            {
                value: "react react-dom",
                name: "React - A library for building UIs",
                checked: false,
            },
            {
                value: "vue",
                name: "Vue.js - The Progressive JavaScript Framework",
                checked: false,
            },
        ],
    },
];

async function main() {
    console.log("\n 👋 Hi, welcome to Create Contao App!\n");
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
    printLn.nfo("🚩 Copying template files");
    await stepCopy(answers);
    await stepFinish(answers);
    printLn.nfo("🚩 All done 🥳");
}

main();
