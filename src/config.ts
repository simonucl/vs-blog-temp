export const SITE = {
  website: "https://simonucl.github.io/vs-blog-temp/", // replace this with your deployed domain
  author: "Jiayi Zhang, Simon Yu, Derek Chong, et al.",
  profile: "https://github.com/CHATS-lab/verbalized-sampling",
  desc: "Verbalized Sampling: A training-free method to restore diversity in aligned LLMs by prompting for probability distributions.",
  title: "Verbalized Sampling",
  ogImage: "og-qualitative.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: false, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: false,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Los_Angeles", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
