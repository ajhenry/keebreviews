export const siteConfig = {
  name: "Keeb Reviews",
  url: "https://keebreviews.com",
  ogImage: "https://keebreviews.com/og.jpg",
  description:
    "User rating and in-depth reviews of mechanical keyboard switches.",
  links: {
    github: "https://github.com/ajhenry/keebreviews",
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
          href: "/switches/reviews/new",
        },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;
