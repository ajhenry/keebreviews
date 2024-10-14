export const siteConfig = {
  name: "shadcn/ui",
  url: "https://ui.shadcn.com",
  ogImage: "https://ui.shadcn.com/og.jpg",
  description:
    "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn-ui/ui",
  },
  sidebar: [
    {
      title: "Switches",
      items: [
        {
          title: "All Switches",
          href: "/switches",
        },
        {
          title: "Write a Review",
          href: "/switches/new",
        },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;
