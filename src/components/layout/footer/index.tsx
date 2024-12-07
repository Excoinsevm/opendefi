import { GitHubLogoIcon } from "@radix-ui/react-icons";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-row justify-center mb-6">
        <span className="text-sm font-medium text-center">
          Open Defi is part of{" "}
          <a
            href="https://www.thehalftimecode.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 dark:text-blue-300"
          >
            The Halftime Code
          </a>{" "}
          series about decentralized finance. <GitHubLogoIcon className="h-4 w-4 ml-2 inline-block" />
        </span>
      </div>
      <div className="flex flex-row justify-center mt-6">
        <span className="text-sm font-medium text-center">
          Would like to hire a fullstack developer?{" "}
          <a
            href="https://www.thehalftimecode.com/contact"
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 dark:text-blue-300"
          >
            Contact me
          </a>
          .
        </span>
      </div>
    </footer>
  );
};

export default Footer;
