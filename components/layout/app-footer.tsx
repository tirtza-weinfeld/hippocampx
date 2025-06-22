import { LinkedInLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons'

export default function AppFooter() {
    const links = [
        { name: 'linkedin', url: 'https://www.linkedin.com/in/tirtza-weinfeld', icon: <LinkedInLogoIcon /> },
        { name: 'github', url: 'https://github.com/tirtza-weinfeld', icon: <GitHubLogoIcon /> },
    ];

    return (
        <footer className="flex flex-row gap-4 h-12 place-content-center place-items-center border-t
         bg-background/50 backdrop-blur-sm">
            
            {links.map((link) => (

                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground/40 hover:text-accent/80 transition-colors duration-200 "
                    >
                        <div className="flex items-center gap-2 ">
                            {link.icon}
                            {link.name}
                        </div>
                    </a>
                ))}
        </footer>
    );
}
