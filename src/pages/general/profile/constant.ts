const publicTabs = ["Recent Streams", "Shorts", "Pricing Plans", "About"];
const tabEnum = {
  RecentStreams: "Recent Streams",
  PricingPlans: "Pricing Plans",
  Shorts: "Shorts",
  About: "About",
  myPlan: "My Plans",
};
const privateTabs = ["Recent Streams", "Shorts", "My Plans", "About"];
const guestTabs = ["Recent Streams", "Shorts", "About"];
const filters = [
  { value: "most_recent", label: "Date Uploaded" },
  { value: "a-z", label: "Ascending A-Z" },
  { value: "z-a", label: "Ascending Z-A" },
];

export { publicTabs, tabEnum, privateTabs, filters, guestTabs };
